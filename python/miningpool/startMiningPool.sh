#!/bin/bash
#script to run Mining Pool Attribution (btc) parser on cron job
echo "Checking if running if not restart"
cd /opt/exchangeAttribution/miningpool/

ps -ef|grep 'python3 /opt/exchangeAttribution/miningpool/miningpool.py' |grep -v grep
if [ $? = "0" ]
then
  echo "Running"
else
  echo "Restart"
  python3 /opt/exchangeAttribution/miningpool/miningpool.py > /opt/exchangeAttribution/miningpool/logs.txt
fi