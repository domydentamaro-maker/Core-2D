<?php

add_action('admin_menu','visioni_ricerca_menu');

function visioni_ricerca_menu(){

add_submenu_page(
'dashboard-visioni',
'Ricerca Gestionale',
'Ricerca',
'manage_options',
'visioni-ricerca',
'visioni_ricerca_page'
);

}

function visioni_ricerca_page(){

?>

<div class="wrap">

<h1>Ricerca Gestionale</h1>

<input type="text" placeholder="Cerca cliente, immobile o codice..." style="width:400px;padding:10px">

<p style="margin-top:20px">Ricerca avanzata in arrivo.</p>

</div>

<?php

}