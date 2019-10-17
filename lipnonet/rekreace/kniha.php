<?php
	include "top.php";
?>

<div class="center">
<br><img src="nadpis_lipenske_forum.gif" width="548" height="39">
<ul class="showAlert" id="showAlert"></ul>
<form id="formular" name="formular" method="post" action="" enctype="multipart/form-data">
<div id="kniha_formular" class="kniha_formular">
  <div>
    <INPUT type="text" NAME=jmeno placeholder="Jméno" size="10" required>
    <INPUT type="text" NAME=email placeholder="E-mail" size="15">
    <select required name=typ>
        <option value="" >  --- vyber kategorii ---</option>
        <option value="0">Fórum</option>
        <option value="1">Inzerce</option>
        <option value="2">Seznamka</option>
        <option value="3">K obsahu stránek</option>
    </select>
  </div>
  <div>
    <textarea type=text class="text-area" name=text placeholder="text" required></textarea>
  </div>
  <div>
    opiš kód : <input type="text" id="antispam" name="antispam" placeholder="" size="5" required>
    
  </div>
</div>

 </form>

 <input type="text" placeholder="hledej" name="livesearch" id="livesearch" >
 <input id="submit" type="Submit" form="formular" name=odesli value="Vlož nový příspěvek">
 <select id="typfilter" name="typfilter">
        <option value="999999" selected>  --- Všechny kategorie ---</option>
        <option value="0">Fórum</option>
        <option value="1">Inzerce</option>
        <option value="2">Seznamka</option>
        <option value="3">K obsahu stránek</option>
    </select>
 <div id="kniha-list-filtered" class="livesearch"></div>

 <div class="kniha_main">
    <div class="kniha_new_entry"></div>
 </div>

 <div class="kniha_pagination"></div>


</div>

<script src="js/kniha.js"></script>

<?php
	include "bottom.php";
?>