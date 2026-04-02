<?php

function visioni_dashboard_page(){

$immobili = wp_count_posts('immobili')->publish ?? 0;
$terreni_interni = wp_count_posts('terreno')->publish ?? 0;
$terreni_vetrina = wp_count_posts('terreni')->publish ?? 0;
$cantieri = wp_count_posts('cantieri')->publish ?? 0;
$clienti = wp_count_posts('cliente')->publish ?? 0;

?>

<div class="wrap">

<h1>Dashboard Gestionale Visioni</h1>

<div style="display:flex;gap:20px;margin-top:30px">

<div style="background:#fff;padding:30px;width:200px">
<h3>Immobili</h3>
<p style="font-size:22px"><?php echo $immobili; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Terreni Interni</h3>
<p style="font-size:22px"><?php echo $terreni_interni; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Terreni Vetrina</h3>
<p style="font-size:22px"><?php echo $terreni_vetrina; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Cantieri</h3>
<p style="font-size:22px"><?php echo $cantieri; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Clienti</h3>
<p style="font-size:22px"><?php echo $clienti; ?></p>
</div>

</div>

</div>

<?php

}