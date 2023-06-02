


// находим родитель у дочернего объекта
function getParentObj(cdm)
{
	var obj = cdm.obj;	
	var next = true;
	
	while(next) 
	{
		if(obj.userData)
		{
			if(obj.userData.tag)
			{
				if(obj.userData.tag == 'obj' || obj.userData.tag == 'roof')
				{
					next = false;
					return obj;					
				}
				else
				{
					if(obj.parent)
					{
						obj = obj.parent;
					}
					else
					{
						next = false;
						return null;
					}
				}
			}
			else if(obj.parent)
			{ 
				obj = obj.parent;
			}
			else
			{
				next = false;
				return null;
			}
			
		}
		else if(obj.parent)
		{ 
			obj = obj.parent;
		}
		else
		{
			next = false;
			return null;
		}
	}
}


