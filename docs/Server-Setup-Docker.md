### Setup of https://bitcoinexplorer.org on Ubuntu 20.04

	# update and install packages
	apt update
	apt upgrade
	apt install docker.io
	
	# get source, npm install
	git clone https://github.com/janoside/prcx-rpc-explorer.git
	cd prcx-rpc-explorer
	
	# build docker image
	docker build -t prcx-rpc-explorer .

	# run docker image: detached mode, share port 3002, sharing config dir, from the "prcx-rpc-explorer" image made above
	docker run --name=prcx-rpc-explorer -d -v /host-os/env-dir:/container/env-dir --network="host" prcx-rpc-explorer
	