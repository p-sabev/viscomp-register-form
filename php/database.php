<?php

    function updateDB(){
        require_once "db.class.php";

        $user = $_SESSION['user'];
        $db->saveArray('users', $user);

        foreach ($_SESSION['address'] as $address) {
            // var_dump($adress);
            $db->saveArray('address', $address);
        }

        foreach ($_SESSION['note'] as $note) {
            $db->saveArray('note', $note);
        }
    }
 ?>