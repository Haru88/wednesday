<?php
	if(isset($_GET["key"]) && isset($_GET["start"])){
		echo json_encode(findValues($_GET["key"], $_GET["start"]));
	}else if (isset($_GET["key"])){
		echo json_encode(findValues($_GET["key"]));
	}else{
		echo "null";
	}
	
	function findValues($key, $start = './'){return nextFolder($start, $key);}

	function nextFolder($path, $key){

		$content = array_diff(scandir($path), array('..', '.'));
		$matches = array();
		foreach($content as &$file){

			$nextPath = $path.$file;
			if(strcmp($file, $key) == 0){

				if(is_dir($nextPath)){

					$files = array_diff(scandir($nextPath), array('..', '.'));
					foreach($files as &$file){$file = $nextPath."/".$file;}	
					$matches = array_merge( $matches, $files );
				}else{

					array_push($matches, json_decode(file_get_contents($nextPath), true));				
					$matches[0]["url"] = $path;
				}

			}else if(is_dir($nextPath)){

				$files = nextFolder($nextPath."/", $key);
				if(count($files ) > 0){

					$matches = array_merge( $matches, $files );
				}
			}		
		}
		return $matches;
	}
?>