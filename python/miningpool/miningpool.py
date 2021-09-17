import argparse
import requests
import json
import re
import os
import time
from sqlDriver import mysqlPool
from sqlDriver import prodSql
from csvDriver import CSV
from multiprocessing import Process
import sys


class Mining():
    def __init__(self, sqlMiner, sqlProd, csvexport, coin):
        self.sqlminer = sqlMiner
        self.coin = coin
        self.prod = sqlProd
        self.csvexport = csvexport

        if (coin == "btc"):
            self.nodeCredentials = ()
            self.nodeUrls = [
                ,
            ]
        elif (coin == "ltc"):
            self.nodeCredentials = ("")
            # Node Url of LTC
            self.nodeUrls = [
                ,
            ]

        elif (coin == "bch"):
            self.nodeCredentials = ()
            # Node Url of BCH

            self.nodeUrls = [""]

        elif (coin == "bsv"):
            self.nodeCredentials = ()
            # Node Url of BSV

            self.nodeUrls = []

        else:
            print("Coin is not supported")
            sys.exit(1)

        self.miners = self.sqlminer.returnAllPools()
        self.latestBlock = self.sqlminer.getLatestBlockID()
        self.block = self.getLatestBlock()

    def postReq(self, method, user, password, node, content):
        url = "http://" + user + ":" + password + "@" + node
        headers = {'content-type': 'application/json'}
        arr = {'method': method,
               'params': content,
               'jsonrpc': '2.0',
               'id': 1}
        payload = json.dumps(arr)
        response = requests.Session().post(url, headers=headers, data=payload, verify=True)
        responseJSON = response.json()
        return responseJSON

    def getBlockHash(self, block):
        block_resp = self.postReq(
            'getblockhash', self.nodeCredentials[0], self.nodeCredentials[1], self.nodeUrls[0], [block])
        return block_resp['result']

    def getCoinBaseTx(self, block_hash):
        block_resp = self.postReq(
            'getblock', self.nodeCredentials[0], self.nodeCredentials[1], self.nodeUrls[0], [block_hash])
        coinbase_tx = block_resp['result']['tx'][0]
        resp_raw = self.postReq(
            'getrawtransaction', self.nodeCredentials[0], self.nodeCredentials[1], self.nodeUrls[0], [coinbase_tx])
        resp_decoded = self.postReq(
            'decoderawtransaction', self.nodeCredentials[0], self.nodeCredentials[1], self.nodeUrls[0], [resp_raw['result']])
        return resp_decoded['result']['vin'][0]['coinbase']

    def decodeCoinBase(self, coinbase):
        l = len(coinbase)//2
        s = ""
        for i in range(0, l):
            c = coinbase[i * 2] + coinbase[(i * 2) + 1]
            try:
                s = s + bytearray.fromhex(c).decode('utf-8')
            except Exception as e:
                pass
        return s

    def findMiner(self, decoded_coinbase):
        for pattern in self.miners:
            match = re.split(pattern, decoded_coinbase, flags=re.IGNORECASE)
            # if pattern == "Poolin":
            #     match = re.split("pooin", decoded_coinbase, flags=re.IGNORECASE)
            if len(match) > 1:
                return pattern

        # match = re.split('Mined by ', decoded_coinbase, flags=re.IGNORECASE)
        # if len(match) > 1:
        #     return 'Mined by ' + match[1]
        return 'unknown'

    def decodeBlock(self, block):
        hahs = self.getBlockHash(block)
        coinbase_tx = self.getCoinBaseTx(hahs)
        payload = self.decodeCoinBase(coinbase_tx)
        miner = self.findMiner(payload)
        return [miner, payload]

    def parseBlock(self, block):
        miner, payload = self.decodeBlock(block)
        new_payload1 = payload.replace("'", "")
        new_payload2 = new_payload1.replace("\\", "")
        try:
            self.sqlminer.insertBlockRow(block, new_payload2, miner)
        except Exception as e:
            print(e)
            sys.exit()

    def recalcFrom300k(self):
        latestBlock = self.sqlminer.getLatestBlockID()
        unknown_blocks = self.sqlminer.getUnknown(latestBlock)
        c = 0
        for block in unknown_blocks:
            block_id, payload = block
            miner = self.findMiner(payload)
            if miner != "unknown":
                self.sqlminer.updateBlock(block_id, miner)
                self.buildAddressList(block_id)

            if c % 1000 == 0:
                print(c)
            c += 1

    def getLatestBlock(self):
        post = self.postReq(
            "getblockchaininfo", self.nodeCredentials[0], self.nodeCredentials[1], self.nodeUrls[0], [])
        block = post['result']['blocks']
        return block

    def addToDB(self):
        self.latestBlock = self.sqlminer.getLatestBlockID()
        self.block = self.getLatestBlock()
        if (self.block - 1) > self.latestBlock:
            for i in range(self.latestBlock + 1, self.block):
                self.parseBlock(i)
                self.buildAddressList(i-2)

    def exportToS3(self, block):
        pass

    def findAddress(self, block):
        addresses = []
        payload, pool_name = self.sqlminer.getBlock(block)
        transaction_hash = self.prod.getTransactionCoinbase(block)
        address_ids = self.prod.getAddressesCoinbase(transaction_hash[0])
        for a in address_ids:
            address = self.prod.getAddressHash(a[0])
            if address[0] != "OP_RETURN":
                addresses.append(address[0])
        return addresses

    def buildAddressList(self, block):
        payload, pool_name = self.sqlminer.getBlock(block)
        if pool_name != "unknown":
            addresses = self.findAddress(block)
            for address in addresses:
                self.sqlminer.insertAddressRow(address, pool_name)

    def liveParser(self):
        while True:
            self.latestBlock = self.sqlminer.getLatestBlockID()
            self.block = self.getLatestBlock()
            if (self.block - 2) > self.latestBlock:
                for i in range(self.latestBlock + 1, self.block - 1):
                    print("Parsing {}".format(i))
                    self.parseBlock(i)
                    self.pushToS3(i)
                    self.buildAddressList(i-10)
            else:
                interval = 10
                print("Sleep {}, last uploaded: {}, latest: {}".format(
                    interval, self.latestBlock, self.block))
                time.sleep(interval)

    def pushToS3(self, block):
        payload, pool_name = self.sqlminer.getBlock(block)
        self.csvexport.saveLocally(pool_name, block)
        print("Pushing to S3 block: {}".format(block))
        self.csvexport.saveS3(block)
        self.csvexport.deleteLocal(block)


parser = argparse.ArgumentParser(description='Miner pool attribution engine')

parser.add_argument('--keyID', type=str, dest='id',
                    default='', help='aws s3 Access key')
parser.add_argument('--secretKey', type=str, dest='secret',
                    default='', help='aws s3 Secret key')
args = parser.parse_args()

print("Connecting...")
# Dev Databases

miner_pool_btc = mysqlPool(host, username, password, "miner_attribution_btc")
miner_pool_ltc = mysqlPool(host, username, password, "miner_attribution_ltc")
miner_pool_bch = mysqlPool(host, username, password, "miner_attribution_bch")
miner_pool_bsv = mysqlPool(host, username, password, "miner_attribution_bsv")

# Prod DB

mysqlProd_btc = prodSql(host, username, password, "btc")
mysqlProd_ltc = prodSql(host, username, password, "ltc")
mysqlProd_bch = prodSql(host, username, password, "bch")
mysqlProd_bsv = prodSql(host, username, password, "bsv")

# CSV export

export_btc = CSV(args.id, args.secret, "btc")
export_ltc = CSV(args.id, args.secret, "ltc")
export_bch = CSV(args.id, args.secret, "bch")
export_bsv = CSV(args.id, args.secret, "bsv")

miner_obj_btc = Mining(miner_pool_btc, mysqlProd_btc, export_btc, "btc")
miner_obj_ltc = Mining(miner_pool_ltc, mysqlProd_ltc, export_ltc, 'ltc')
miner_obj_bch = Mining(miner_pool_bch, mysqlProd_bch, export_bch, "bch")
miner_obj_bsv = Mining(miner_pool_bsv, mysqlProd_bsv, export_bsv, "bsv")
print("Connected")


def miningBTC():
    print("started BTC parser")
    miner_obj_btc.liveParser()


def miningLTC():
    print("started LTC parser")
    miner_obj_ltc.liveParser()


def miningBCH():
    print("Started BCH Parser")
    miner_obj_bch.liveParser()


def miningBSV():
    print("Started BSV Parser")
    miner_obj_bsv.liveParser()


p1 = Process(target=miningBTC)
p2 = Process(target=miningLTC)
p3 = Process(target=miningBCH)
p4 = Process(target=miningBSV)
p1.start()
p2.start()
p3.start()
p4.start()
