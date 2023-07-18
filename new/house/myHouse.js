

class MyHouse
{
	myPoint;
	myMovePoint;
	myPointAction;
	
	myWall;
	myWallMove;
	
	myDoor;
	myWindow;
	myWD;
	myWDMove;
	myWDPoints;
	myWDPointsMove;
	MyWDRulers;
	
	MyObjMove;
	
	constructor()
	{
		this.myPoint = new MyPoint();
		this.myMovePoint = new MyMovePoint();
		this.myPointAction = new MyPointAction();
		
		this.myWall = new MyWall();
		this.myWallMove = new MyWallMove();
		
		this.myDoor = new MyDoor();
		this.myWindow = new MyWindow();
		this.myWD = new MyWD();
		this.myWDMove = new MyWDMove();
		this.myWDPoints = new MyWDPoints();
		this.myWDPointsMove = new MyWDPointsMove();
		this.myWDRulers = new MyWDRulers();
			
		this.myRoofUI = new MyRoofUI();
		this.myRoofAction = new MyRoofAction();
		this.myRoofObj = new MyRoofObj();
		this.myRoofCSG = new MyRoofCSG();
		this.myRoofMove = new MyRoofMove();
		
		this.myObjUI = new MyObjUI();
		this.myObjAction = new MyObjAction();
		this.myObjPrimitives = new MyObjPrimitives();				
		this.myObjMove = new MyObjMove();
	}
	
	initBtn()
	{
		
	}
		

}







