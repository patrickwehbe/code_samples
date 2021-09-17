import boto3
import os
import shutil
import csv
import sys

class CSV():
    def __init__(self,id, secret, coin):
        self.coin = coin
        self.region = "us-west-2"
        self.res = boto3.resource('s3',
                             region_name=self.region,
                             aws_access_key_id=id,
                             aws_secret_access_key=secret)
        self.s3Bucket = self.res.Bucket('test-bucket')
        self.local = "csv_test"
        self.s3Path = coin

    def saveLocally(self, poolName, blockNumber):
        try:
            os.mkdir('{}/{}'.format(self.local, blockNumber))
        except FileExistsError:
            try:
                shutil.rmtree('{}/{}'.format(self.local, blockNumber))
                os.mkdir('{}/{}'.format(self.local, blockNumber))
            except OSError:
                logging.error('Failed to remove directory for block {}'.format(blockNumber))
                raise

        simpleFile = open('{}/{}/{}_{}BlockPoolName.csv'.format(self.local, blockNumber, blockNumber, self.coin), 'a')

        
        try:
            row = (poolName, "")
            writer = csv.writer(simpleFile, sys.stdout, lineterminator='\n')
            writer.writerow(row)
        except KeyError as e:
            print("Something went wrong saveLocally (CSV): {}".format(e))




    def saveS3(self, blockNumber):
        self.s3Bucket.upload_file('{}/{}/{}_{}BlockPoolName.csv'.format(self.local, blockNumber, blockNumber, self.coin),
                             '{}/{}/{}_{}BlockPoolName.csv'.format(self.s3Path, blockNumber, blockNumber, self.coin))
        
    def deleteLocal(self, blockNumber):
        if os.path.exists('{}/{}'.format(self.local, blockNumber)):
            shutil.rmtree('{}/{}'.format(self.local, blockNumber))
        else:
            print("The file does not exist")

    def check_existence(self, block):
        key = self.s3Path + "/" + str(block)
        folder = list(self.s3Bucket.objects.filter(Prefix=key))
        return len(folder)