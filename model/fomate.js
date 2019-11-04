module.exports=function(a){
	var week=a.getDay()
	if(week==1){
		week="一"
	}else if(week==2){
		week="二"
	}else if(week==3){
		week="三"
	}else if(week==4){
		week="四"
	}else if(week==5){
		week="五"
	}else if(week==6){
		week="六"
	}else if(week==0){
		week="日"
	}
	return a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+' 星期'+week
}
