let myMap=new Map();
myMap.set("bank", 50);
myMap.set("atm", 40);
myMap.set("bar", -100);
myMap.set("casino", -60);
myMap.set("cemetery", -40);
myMap.set("embassy", 60);
myMap.set("church", 40);
myMap.set("fire_station", 50);
myMap.set("hindu_temple", 50);
myMap.set("hospital", 50);
myMap.set("liquor_store", -80);
myMap.set("local_government_office", 40);
myMap.set("mosque", 40);
myMap.set("night_club", -40);
myMap.set("police", 150);
myMap.set("post_office", 70);

// Assuming a 2D Array routePointsType to be given by Backend API team
routePointsType=new Array(3);
routePointsType[0]=new Array("bank", "gym", "food");
routePointsType[1]=new Array("bar");
routePointsType[2]=new Array("police", "restaurant");

var score =0;
console.log(score);
console.log(routePointsType.length);
for(var i=0;i<routePointsType.length; i++)
{   
    console.log("Size: "+routePointsType[i].length);
    for(var j=0;j<routePointsType[i].length; j++)
    {
        if(myMap.has(routePointsType[i][j]))
        {
            console.log(routePointsType[i][j]+" " +myMap.get(routePointsType[i][j]));
            score+=myMap.get(routePointsType[i][j])
        }    
    }
}
console.log(score);