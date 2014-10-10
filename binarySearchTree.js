/*binary search tree implementation
Implemented with nodes and pointers
Note: Not self-balancing

compFunc: a comparator function that compares 2 nodes of the BST (not required)
isKeyed: describes if the BST is keyed (not required) enforced for inserting nodes
*/
var BinarySearchTree = function (compFunc, isKeyed) {
	var that = {};
	var root = null;
	var numNodes = 0;

	/*default comparator function
	node1: first node to compare
	node2: second node to compare
	
	can be overwritten by user inputted comparator function
	*/
	var defaultCompFunc = function (node1, node2){
		if (isKeyed){
			if (node2.getKey() > node1.getKey()){
				return true;
			}else {
				return false;
			}
		}else {
			if (node2.getVal() > node1.getVal()){
				return 1;
			}else if (node2.getVal() == node1.getVal()) {
				return 0;
			}else {
				return -1;
			}
		}
	};
	that.comp = compFunc || defaultCompFunc;

	var getRoot = function(){
		return root;
	};
	that.getRoot = getRoot;

	/*insert function
	runtime: O(logn)
	*/
	var insert = function(val, key) {
		if (root==null){
			root=BSTNode(val, key);
		}else {
			ins (root, BSTNode(val, key));
		}

		function ins (curNode, newNode){
			if (that.comp(curNode, newNode) == 1){
				if (curNode.getRightChild() == null){
					curNode.setRightChild(newNode);
				}else {
					ins(curNode.getRightChild(), newNode);
				}
			}else {
				if (curNode.getLeftChild() == null){
					curNode.setLeftChild(newNode);
				}else {
					ins(curNode.getLeftChild(), newNode);
				}
			}
		}

	};
	that.insert = insert;

	/*remove function
	runtime: O(logn)
	*/
	var remove= function(val){
		if (val==null){
			return false;
		}else {
			var targetNode = search(val);
			if (targetNode!=null){
				return removeHelper(targetNode);
			}else {
				return false;
			}
		}

		function removeHelper (targetNode){
			function rightMostNode (targetNode){
				var curNode = targetNode.getLeftChild();
				while (curNode.getRightChild()!=null){
					curNode = curNode.getRightChild();
				}
				return curNode;
			}


			var parent = targetNode.getParent();
			var lChild = targetNode.getLeftChild();
			var rChild = targetNode.getRightChild();

			if (lChild == null && rChild == null){
				if (parent==null) {
					root = null;
					return true;
				}
				
				if (that.comp(parent.getRightChild(), targetNode)==0){
					parent.setRightChild(null);
				}else {
					parent.setLeftChild(null);
				}
			}else if (lChild != null && rChild == null){
				if (parent==null) {
					root = lChild;
					lChild.setParent(null);
					return true;
				}
				if (that.comp(parent.getRightChild(), targetNode)==0){
					parent.setRightChild(lChild);
				}else {
					parent.setLeftChild(lChild);
				}
			}else if (lChild == null && rChild != null){
				if (parent==null) {
					root = rChild;
					rChild.setParent(null);
					return true;
				}
				if (that.comp(parent.getRightChild(), targetNode)==0){
					parent.setRightChild(rChild);
				}else {
					parent.setLeftChild(rChild);
				}
			}else {

				var rightMostNode = rightMostNode(targetNode);

			
				if (parent==null) {
					root = rightMostNode;
				}else {
					if (that.comp(parent.getRightChild(), targetNode)==0){
						parent.setRightChild(rightMostNode);
					}else {
						parent.setLeftChild(rightMostNode);
					}
				}
				removeHelper(rightMostNode);
				if(that.comp(rChild, rightMostNode)==-1){
					rightMostNode.setRightChild(rChild);
				}

				if(that.comp(lChild, rightMostNode)==1){
					rightMostNode.setLeftChild(lChild);
				}

				if (parent==null){
					rightMostNode.setParent(null);
				}

			}
			return true;
		}

	}
	that.remove = remove;

	/*search function
	Note: dfs in BST has runtime O(logn) because everything is sorted
	val: value of the node to be searched
	key: key of the node to be search (required in a keyed BST)
	*/
	var search = function(val, key){

		if (val == null){
			return null;
		}else {
			var node= searchHelper(root, BSTNode(val, key));
			return node;
		}

		function searchHelper (curNode, targetNode){
			var compare = that.comp(curNode, targetNode);
			if (compare==0){
				return curNode;
			}else if (compare==1){
				if (curNode.getRightChild()==null){
					return null;
				}else {
					return searchHelper (curNode.getRightChild(), targetNode);
				}
			}else {
				if (curNode.getLeftChild()==null){
					return null;
				}else {
					return searchHelper (curNode.getLeftChild(), targetNode);
				}
			}
		};

	}
	that.search = search;
/**************Traversal of BST*****************/

	/*recursive pre-order traversal of tree
	runtime: O(n)
	Prints out nodes as they are visited
	*/
	var preOrderTrav = function(){
		trav(root);

		function trav (node){
			if (!node){
				return;
			}
			console.log(node.getVal());
			trav(node.getLeftChild());
			trav(node.getRightChild());
		}
	}
	that.preOrderTrav = preOrderTrav;

	/*recursive in-order traversal of tree
	runtime: O(n)
	Prints out nodes in order
	*/
	var inOrderTrav = function(){
		trav(root);

		function trav (node){
			if (node == null){
				return;
			}
			trav(node.getLeftChild());
			console.log(node.getVal());
			trav(node.getRightChild());
		}
	}
	that.inOrderTrav = inOrderTrav;

	/*recursive post-order traversal of tree
	runtime: O(n)
	Prints out nodes from left to right
	*/
	var postOrderTrav = function(){
		trav(root);

		function trav (node){
			if (!node){
				return;
			}
			trav(node.getLeftChild());
			trav(node.getRightChild());
			console.log(node.getVal());
		}
	}
	that.postOrderTrav = postOrderTrav;
	return that;
}

/*BST node
val: value of the node (required)
key: key to sort the node by (not required)
*/
var BSTNode = function(val, key) {
	var that = {};

	if (val == null){
		throw "Must input valid value for BST node";
	}
	var val = val;

	var key = key || null;
	var parent = null;
	var lChild = null;
	var rChild = null;

	/*getters*/
	var getVal = function() {
		return val;
	};
	that.getVal = getVal;

	var getKey = function(){
		if (!key){
			throw "BST node does not have key";
		}
		return key;
	};
	that.getKey = key;

	/*setters*/
	var setVal = function(newVal){
		if (!newVal){
			throw "Invalid value for BST node";
		}

		that.val = newVal;
	};
	that.setVal = setVal;

	var setKey = function(newKey){
		if (!newKey){
			throw "Invalid key for BST node";
		}

		that.key = newKey;
	};
	that.setKey = setKey;

	/*setter and getter for child nodes*/
	var getLeftChild = function(){
		return lChild;
	};
	that.getLeftChild = getLeftChild;

	var getRightChild = function(){
		return rChild;
	};
	that.getRightChild = getRightChild;

	var getParent = function(){
		return parent;
	}
	that.getParent = getParent;

	var setLeftChild = function(node){
		lChild = node;
		if (node!=null){
			node.setParent(this);
		}
	};
	that.setLeftChild = setLeftChild;

	var setRightChild = function(node){
		rChild = node;
		if (node!=null){
			node.setParent(this);
		}
	};
	that.setRightChild = setRightChild;

	var setParent = function(node){
		parent = node;
	}
	that.setParent = setParent;
	return that;
};


var tree = BinarySearchTree();
tree.insert(100);
tree.insert(10);
tree.insert(103);
tree.insert(200);
tree.insert(0);
tree.insert(5);
tree.insert(30);
tree.insert(203);
tree.insert(101);
tree.insert(102);
//tree.inOrderTrav();
//tree.preOrderTrav();
//tree.postOrderTrav();

tree.remove(0);
tree.remove(5);
tree.remove(101);
tree.remove(102);
tree.remove(30);
tree.remove(100);
tree.remove(10);	
tree.remove(200);
tree.remove(203);

tree.remove(10);
tree.remove(103);

tree.inOrderTrav();