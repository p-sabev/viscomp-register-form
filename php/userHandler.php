<?php
    session_start();
    session_destroy();
    session_start();
    require_once "db.class.php";

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $errorList = [];

    if (!(preg_match('/^[а-яA-Яa-zA-Z]{3,20}$/i', $data->{'first_name'}))) { array_push($errorList, 'first_name'); }
    if (!(preg_match('/^[а-яA-Яa-zA-Z]{3,20}$/i', $data->{'last_name'}))) { array_push($errorList, 'last_name'); }
    if ((strlen($data->{'surname'}) != 0) and !(preg_match('/^[а-яA-Яa-zA-Z]{5,20}$/i', $data->{'surname'}))) { array_push($errorList, 'surname'); }
    if (!(preg_match('/^[a-z\d_]{6,20}$/i', $data->{'username'}))) {
        array_push($errorList, 'username');
    } else {
        // $result = $db->getBy('users', 'username', $data->{'username'});
        // echo json_encode($result);
    }


    $mailRegex = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,10})$/';
    if (!(preg_match($mailRegex, $data->{'email'}))) { array_push($errorList, 'email');}

    if ((strlen($data->{'phone_number'}) != 0) and !(preg_match('/^\(?[0-9]{3}\)?|[0-9]{3}[-. ]? [0-9]{3}[-. ]?[0-9]{4}$/', $data->{'phone_number'}))) { array_push($errorList, 'phone_number'); }


    if(!empty($errorList)) {
        echo json_encode($errorList);
    } else {
        $_SESSION['address'] = array();
        $_SESSION['note'] = array();
        $_SESSION['user'] = json_decode($json, true);
    }

?>