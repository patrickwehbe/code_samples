import mysql.connector
import time
import math
import sys




class mysqlPool:
    # method to connect to sql and return connector object
    def __init__(self, host, user, password, db):
        self.mydb = mysql.connector.connect(host=host, user=user, passwd=password, database=db)

    def returnPoolId(self, pool_name):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("SELECT id FROM pool_list WHERE pool_name =  '%s'" % pool_name)
            result = cursor.fetchone()
            cursor.close()
            return result
        except mysql.connector.Error as e:
            print("Something went wrong returnPoolId: {}".format(e))

    def returnAllPools(self):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("SELECT pool_name FROM pool_list ")
            result = cursor.fetchall()
            cursor.close()
            final = []
            for row in result:
                final.append(row[0])
            return final
        except mysql.connector.Error as e:
            print("Something went wrong returnAllPools: {}".format(e))

    def getBlock(self, block_id):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("SELECT payload, pool_name FROM block_miners WHERE block_id =  '%s'" % block_id)
            result = cursor.fetchone()
            cursor.close()
            return result
        except mysql.connector.Error as e:
            print("Something went wrong getBlock: {}".format(e))

    def insertPoolName(self, pool_name):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute(
                "INSERT pool_list (pool_name) VALUES ('%s') " % pool_name)
            self.mydb.commit()
        except mysql.connector.Error as e:
            print("Something went wrong insertPoolName: {}".format(e))

    def insertBlockRow(self, block_id, payload, pool_name):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute(
                """INSERT block_miners (block_id, payload, pool_name) VALUES ('%s', '%s', '%s') """ % (block_id, payload, pool_name))
            self.mydb.commit()
        except mysql.connector.Error as e:
            print("Something went wrong insertBlockRow: {}".format(e))

    def insertAddressRow(self, address, pool_name):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute(
                """INSERT address_miner (address, pool_name) VALUES ('%s', '%s') """ % (address, pool_name))
            self.mydb.commit()
        except mysql.connector.Error as e:
            # print("Something went wrong insertAddressRow: {}".format(e))
            pass

    def getLatestBlockID(self):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("SELECT max(block_id) FROM block_miners ")
            result = cursor.fetchone()
            cursor.close()
            return result[0]
        except mysql.connector.Error as e:
            print("Something went wrong getLatestBlockID: {}".format(e))

    def getUnknown(self, recent_block_id):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("""SELECT block_id, payload FROM block_miners WHERE 
                            block_id > 300000 AND block_id <= '%s' AND pool_name = 'unknown' """ % recent_block_id)
            result = cursor.fetchall()
            cursor.close()
            final = []
            for row in result:
                final.append(row)
            return final
        except mysql.connector.Error as e:
            print("Something went wrong getUnknown: {}".format(e))

    def updateBlock(self, block_id, miner):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute(
                "UPDATE block_miners SET pool_name = '%s' WHERE block_id = '%s'" % (miner, block_id))
            self.mydb.commit()
        except mysql.connector.Error as e:
            print("Something went wrong updateBlock: {}".format(e))


class prodSql:
    #method to connect to sql and return connector object
    def __init__(self, host, user, password, coin):
        self.coin = coin
        self.mydb = mysql.connector.connect(host=host, user=user, passwd=password, database=self.coin)

    def getTransactionCoinbase(self, block_id):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("""SELECT id FROM transaction 
                            WHERE tx_index_in_block = 0 AND block_id = '%s' """ % (block_id))
            result = cursor.fetchone()
            return result
        except mysql.connector.Error as e:
            print("Something went wrong getTransactionCoinbase: {}".format(e))

    def getAddressesCoinbase(self, transaction_id):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("""SELECT address_id FROM output WHERE tx_id = '%s' """ % (transaction_id))
            result = cursor.fetchall()
            cursor.close()
            final = []
            for row in result:
                final.append(row)
            return final
        except mysql.connector.Error as e:
            print("Something went wrong getAddressesCoinbase: {}".format(e))

    def getAddressHash(self, address_id):
        try:
            cursor = self.mydb.cursor(buffered=True)
            cursor.execute("""SELECT hash FROM address WHERE id = '%s' """ % (address_id))
            result = cursor.fetchone()
            return result
        except mysql.connector.Error as e:
            print("Something went wrong getTransactionCoinbase: {}".format(e))