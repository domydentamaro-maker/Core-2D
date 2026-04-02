<?php

add_action('admin_menu','visioni_mappa_menu');

function visioni_mappa_menu(){

add_submenu_page(
'dashboard-visioni',
'Mappa Immobili',
'Mappa',
'manage_options',
'visioni-mappa',
'visioni_mappa_page'
);

}

function visioni_mappa_page(){

?>

<div class="wrap">

<h1>Mappa Immobili</h1>

<p>Qui vedrai tutti gli immobili su mappa.</p>

<p>Utilizzeremo mappe gratuite OpenStreetMap.</p>

</div>

<?php

}