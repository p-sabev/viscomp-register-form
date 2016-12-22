<?php
    session_start();

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $errorList = [];

    if (!(preg_match('/^([\sa-zA-Zа-яА-Я,\\d])+$/i', $data->{'address_row_1'}))) { array_push($errorList, 'address_row_1'); }
    if ((strlen($data->{'address_row_2'}) != 0) and !(preg_match('/^([\sa-zA-Zа-яА-Я,\\d])+$/i', $data->{'address_row_2'}))) { array_push($errorList, 'address_row_2'); }
    if (!(preg_match('/^[0-9-]{2,20}$/i', $data->{'post_code'}))) { array_push($errorList, 'post_code'); }
    if (!(preg_match('/^[\sa-zA-Zа-яА-Я]{3,50}$/i', $data->{'city'}))) { array_push($errorList, 'city'); }
    if ((strlen($data->{'area'}) != 0) and !(preg_match('/^[\sa-zA-Zа-яА-Я]{3,50}$/i', $data->{'area'}))) { array_push($errorList, 'area'); }
    if (!(preg_match('/^[\sa-zA-Zа-яА-я]{3,50}$/i', $data->{'country'}))) { array_push($errorList, 'country'); }


    if(!empty($errorList)) {
        echo json_encode($errorList);
    } else {
        array_push($_SESSION['address'], json_decode($json, true));
    }

?>