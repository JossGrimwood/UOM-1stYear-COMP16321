<?php
error_reporting(0);
require("inc/config.php");
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = explode("/", $url);

$pid = pcntl_fork();
if ($pid == -1) {
    die('Error while creating child process');
} else if ($pid) {
    if ($url[count($url)-2] == "getArea") {
        $args = explode("," ,$url[count($url)-1]);
        $requestArea = new getDataByArea($args[0],$args[1],$args[2]);
        $data = $requestArea->getData();
    } elseif ($url[count($url)-2] == "mmsi") {
        $requestMMSI = new getMMSI($url[count($url)-1]);
        $data = $requestMMSI->getData();
    } elseif ($url[count($url)-2] == "name") {
        $requestName = new getName($url[count($url)-1]);
        $data = $requestName->getData();
    } elseif ($url[count($url)-2] == "getByFilters") {
        $args = explode("," ,$url[count($url)-1]);
        $requestArea = new getDataByFilters($args[0],$args[1],$args[2],$args[3]);
        $data = $requestArea->getData();
    }
} else {
    $bound
    $pid = pcntl_fork();
    if ($pid == -1) {
         die('Error while creating child process');
    } else if ($pid) {
        $pid = pcntl_fork();
        if ($pid == -1) {
             die('Error while creating child process');
        } else if ($pid) {
            $bound = 0
        } else {
            $bound = 12
        }
    } else {
        $pid = pcntl_fork();
        if ($pid == -1) {
             die('Error while creating child process');
        } else if ($pid) {
            $bound = 25
        } else {
            $bound = 48
        }
    }
     try {
            $update = new rollingRequest();
            $update->nextArea($bound);
            for ($i=$bound; $i < $bound + 13; $i++) { 
                $update->nextArea();
            }
        } catch (\Throwable $th) {
            #echo("server not working")
        }
}


header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
echo $data;
pcntl_wait($status)
?>