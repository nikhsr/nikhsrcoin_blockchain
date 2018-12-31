const SHA256=require('crypto-js/sha256');
class Transaction{
	constructor(fromAdd, toAdd , amount){
		this.fromAdd=fromAdd;
		this.toAdd=toAdd;
		this.amount=amount;

	}
}

class Block {
	constructor( timestamp, transaction, previousHash = '') {

		this.timestamp = timestamp;
		this.transaction = transaction;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce=0;
	}

	calculateHash() {
		return SHA256( this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.transaction)).toString();
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
		this.pendingTransaction=[];
		this.miningReward=100;
	}

	static createGenesisBlock() {
		return new Block( "08/05/1997", "birth", '0')
	}

	getlatestBlock(){
		return this.chain[this.chain.length-1]
	}
	minePendingTrans(miningRewardAdd){
		let block = new Block(Date.now(),this.pendingTransaction);
		block.mineBlock(2);
		console.log("block successfully mined!");
		this.chain.push(block);

		this.pendingTransaction=[
			new Transaction(null,miningRewardAdd,this.miningReward)
		];
	}
	createTran(transaction){
		this.pendingTransaction.push(transaction);

	}
	getBalance(address){
		let balaance=0;
		for(const block of this.chain){
		for(const trans of block.transaction){
			if(trans.fromAdd===address){
				balaance-=trans.amount;
			}
			if (trans.toAdd===address){
				balaance+=trans.amount;
			}
		}}
		return balaance;
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
// console.log("Mining block 1....");
// nikhsrcoin.addBlock(new Block(1,'31/12/2018',{amount : 4}));
// console.log("Mining Block 2...");
// nikhsrcoin.addBlock(new Block(2,'01/01/2019',{amount : 13}));
//
//
// console.log('Is blockchain Valid '+nikhsrcoin.isChainValid());
// nikhsrcoin.chain[1].data={amount:122};
// console.log('Is blockchain Valid '+
nikhsrcoin.createTran(new Transaction('address1','address2',400));
nikhsrcoin.createTran((new Transaction('address2','address1',200)));
console.log("\n Starting the miner");
nikhsrcoin.minePendingTrans('bfdbddfb');
console.log('\nBalance of address1',nikhsrcoin.getBalance('address1'))

