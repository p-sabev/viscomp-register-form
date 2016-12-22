<?php

    function updateDB(){
        require_once "db.class.php";

        $user = $_SESSION['user'];
        $address = $_SESSION['address'];
        $note = $_SESSION['note'];
        $user_id = '';

        $db->saveArray('users', $user);

        $username = $user['username'];
        $getUserQuery = "SELECT * FROM `users` WHERE `username` = '$username'";
        $result_1 = $db->fetchArray($getUserQuery);

        $user_id = $result_1[0]['id'];

        $getAddressQuery = "SELECT * FROM `address` ORDER BY `id` DESC";
        $result_2 = $db->fetchArray($getAddressQuery);

        $last_address_id = $result_2[0]['id'];
        $address_new_id = $last_address_id + 1;

        foreach ($address as $key => $addresses) {

            $user_address = [
                'user_id' => $user_id,
                'address_id' => $address_new_id
            ];

            $db->saveArray('address', $addresses);
            $db->saveArray('users_addresses', $user_address);
            $address_new_id++;
        }

        foreach ($note as $key => $notes) {
            $anote = [
                'note' => $notes,
                'user_id' => $user_id
            ];
            $db->saveArray('notes', $anote);
        }

        header("HTTP/1.1 999 OK");
        $resultData = [ $user, $address, $note ];
        echo json_encode($resultData);


        // var_dump($_SESSION['note']);
        // echo '<script type="text/javascript"> visualizeData(' + $user + ',' + $address + ',' + $note + '); </script>';
    }
 ?>