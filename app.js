const SHA256=require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce=0;
	}

	calculateHash() {
		return SHA256(this.index + this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.data)).toString();
	}
	mineBlock(difficulty){
		while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
			this.nonce++;
			this.hash=this.calculateHash();
		}
		console.log("Block mined:"+ this.hash)
	}
}

class Blockchain{
	constructor() {
		this.chain = [Blockchain.createGenesisBlock()];
	}

	static createGenesisBlock() {
		return new Block(0, "08/05/1997", "birth", '0')
	}

	getlatestBlock(){
		return this.chain[this.chain.length-1]
	}

	addBlock(newBlock){
		newBlock.previousHash=this.getlatestBlock().hash;
		newBlock.mineBlock(5);
		this.chain.push(newBlock)
	}



	isChainValid(){
		for(let i =1;i<this.chain.length;i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			if(currentBlock.hash!==currentBlock.calculateHash()){
				return false;
			}
			if(currentBlock.previousHash!==previousBlock.hash){
				return false;
			}
			else{
				return true;
			}
		}
	}

}
let nikhsrcoin =new Blockchain();
console.log("Mining block 1....");
nikhsrcoin.addBlock(new Block(1,'31/12/2018',{amount : 4}));
console.log("Mining Block 2...");
nikhsrcoin.addBlock(new Block(2,'01/01/2019',{amount : 13}));


console.log('Is blockchain Valid '+nikhsrcoin.isChainValid());
nikhsrcoin.chain[1].data={amount:122};
console.log('Is blockchain Valid '+nikhsrcoin.isChainValid());
