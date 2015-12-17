<?php

    header("Access-Control-Allow-Origin: *");

    if (is_array($_POST) && isset($_POST['map'])) {

    	$arr = json_decode($_POST['map']);
    	// var_dump($arr);


        $fp = fopen('map01.csv', 'w');
        // fputcsv($fp, explode(',', $arr));

		foreach ($arr as $file) {
		    $result = [];
		    array_walk_recursive($file, function($item) use (&$result) {
		        $result[] = $item;
		    });
		    fputcsv($fp, $result);
		}

        fclose($fp);
        echo 'yes! map saved';

     }

    $map = fopen('map01.csv', 'r') or die('Unable to open file!');
    echo fread($map,filesize('map01.csv'));
    fclose($map);

?>