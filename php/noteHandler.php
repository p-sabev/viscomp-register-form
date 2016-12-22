<?php
    session_start();
    require_once "updateDB.php";

    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $next = $data->{'next'};

    unset($data->{'next'});

    $note = $data->{'note'};
    $note = trim($note);
    $note = htmlentities($note, ENT_HTML5 | ENT_QUOTES, 'UTF-8');

    array_push($_SESSION['note'], $note);
    if($next){
        updateDB();
    }

?>