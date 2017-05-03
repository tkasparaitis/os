/*

data segmentas 30 ram



skaitliuka / 4
PC turi gauti PCV reiksme
R keturiu ploti

Supervizorine atminti ikisti i realios atminties gala

Sukurti 

+Reli uzkrauti supervizotine
Pravaliduoja
  komandas+
  duomensi+-
 + TI 15 set PRTR set flag (jis reikalingas 4 del resursu perkeitimo)
  
  
 - sukuriame puslapius ram perkeliame duomenis
 + SUPER valyti nereikia
 + RAMo netriname irgi
  
  
Isijungai VM 

TIK PROGRAMOS DUOMENYS BE PAVADINIMO

ST
XX +
AD +
MN +
ML +
PR +
PS +
PD +
RD
GO
IF
KILL
LG
JM
JA
JB
JE
JN




*/

var comands = ["ST", "XX", "AD", "MN", "ML", "PR", "PS", "PD", "RD", "GO", "IF", "KILL", "LG", "JM", "JA", "JB", "JE", "JN"];

//datasegmentas
ds = 30;

//var example1 = "XX01\nPS20\n1234\nPS30\n2345\nPR20\nAD30\nPS40\nPD40\nKILL\nXX02\nSuma\nPS20\n1234\nPS30\n2345\nPR20\nAD30\nPS40\nPD40\nKILL"; //"START\nSuma\n1234\nPS20\n2345\nPS30\nPR20\nADD30\nPS40\nPD40";

//var example1 = "XX01\n1234\n2345\nSTAR\nPS01\nPS02\nPR02\nAD02\nPS04\nPD04\nKILL\nXX02\n1234\n2345\nSTAR\nPS01\nPS02\nPR01\nAD02\nPS03\nPD03\nKILL"; //"START\nSuma\n1234\nPS20\n2345\nPS30\nPR20\nADD30\nPS40\nPD40";
var example1 = "XX01\n1234\n2345\n0000\n0000\nSTAR\nPR01\nAD02\nPS03\nPR04\nPD03\nKILL\nXX02\n1234\n2345\n0000\n0000\nREZU\nLTAT\nAS: \nSTAR\nPR01\nAD02\nPS03\nPR04\nPD05\nPD06\nPD07\nPD03\nKILL"; //"START\nSuma\n1234\nPS20\n2345\nPS30\nPR20\nADD30\nPS40\nPD40";

var example2 = "START\nSuma\n1234\nPS20\nKILL";
var hddpos = 0;
var comad = [];

var rrams = 512;
var rams = 128;
var supers = 128;
var stekas = 128;

var progToSuper = [];

//einamojo vm numeris
var curvm = 1;
var mode = 1;

/*********************************************
 * Data sync function
 **********************************************/
function syncData(){
//save vm id at rm object

//super sync
    for (var si = 1; si <= supers; si++) {
        putVatTable(getVal(si,'super'),(rrams-supers+si), 'rram');
    }

//ram sync
    for (var si2 = 1; si2 <= rams; si2++) {
        putVatTable(getVal(si2,'rram'),si2, 'ram');
    }
//r sybc
    $("#rv").html($("#r").html())

}

/*********************************************
 * Data Ti increase
 **********************************************/
function incTI(){
// ad to rm as method

	var ti = parseInt($('#ti').html());
	if(ti>14)
		{ ti = 0; $('#prtr').html('001'); }
	else
		{ ti++; }
	if(ti < 10)
		{$('#ti').html('0'+ti); }
    else
		{$('#ti').html(ti); }
	console.log('TI: ' + ti);
//	console.log(ti)

}

/*********************************************
 * Put data to steck
 **********************************************/
//function putData(fun){}
/*********************************************
 * Get data from steck
 **********************************************/
//function checkData(fun){}
/*********************************************
 * Check Data and load to super function
 **********************************************/
function checkData(fun){

	var start = 0;
	var error = 0;
	
    //console.log(comands);


    comand = $("#terminal").val().toUpperCase();
    programs   = $("#code").val().toUpperCase().split("KILL");
	
    $(programs).each(function () {

        var beg = 0;
		var tht = this + "\nKILL";
    	program = tht.toUpperCase().split("\n");

    	$(program).each(function () {
            if(comand == this){ start = 1; }

			if(this.length > 0) {
				com = this[0]+this[1];

                if(com == 'ST'){ beg = 1 }
                if(com == 'KI'){ beg = 0 }
				if((beg == 1) && ($.inArray( com, comands ) < 0) ){ error = 1; }

            }
		});

    });

    //console.log(comand);
    //console.log(code);

    if((comand == '')||(comand.slice(0, 4) == 'ERRO')){ comand = ''; error = 3; }
    //console.log(start + ' ' + error);
	if((start == 0) && (error == 0)){
        error = 2;
	}

	if(error == 0){
		return 1;
	} else {
        erroR(error);
        return 0;
	}

}

function loadSuper(prg){


    comand = $("#terminal").val().toUpperCase();
    programs   = $("#code").val().toUpperCase().split("KILL");
	
	//console.log(programs);
    var pos = 0;
    var pos2 = 0;
    var at = rrams-supers;
    var start = 0;
    var beg = 0;
    $(programs).each(function () {

		var tht = this + "\nKILL";
    	program = tht.toUpperCase().split("\n");

        $(program).each(function () {

            if(comand == this){ start = 1; } //else { start = 0; }
            if(this.length > 0) {
                com = this[0]+this[1];
                com2 = com +this[2]+this[3];

                if(com == 'ST'){ beg = 1 }
                if(com == 'KI'){ beg = 0;}
				
				if(com2 == 'KILL'){ start = 0; }

                if((beg == 1) && (start == 1)){ if(pos){ putVatTable(com2, pos, 'super'); } pos++; }
                if((beg == 0) && (start == 1)){ if(pos){ putVatTable(com2, pos, 'super'); } pos++; }
				//console.log(beg);

                //console.log(com)
            }
        });

    });

    putVatTable('KILL', pos, 'super');

}

function readData(start, size = 4){
	
	val = $('#code').val();
	console.log(val)
	
	}

function createTable(r, c, id, ref, name = ''){
	
	
	var table = '<table id="'+id+'"><tr><th colspan="'+(c+1)+'"><h4>' + name + '</h4></th></tr>';
	row = '';
	col = '';
		
	
	for(i=0; i<r; i++){
		row = '<tr><td class="nr">'+(i+1)+'</td>';
			for(y=0; y < c; y++){ row = row + '<td>0</td>' }
		row = row + col + '</tr>';
		table = table + row;
		}
	table = table + '</html>';
	
	$('.components .scroll').append(table);
		
	$( "#"+id ).draggable();
		
	}
	
function outPut(msg, type = 0){

	//console.log('OS: ' + msg);
	console.log('zinute:'+msg);
	
	term = $('#terminal').val()
	$('#terminal').val(term + msg);
	
	
	if(type){ alert(msg); }
}

/*********************************************
 * Error code
 **********************************************/
function erroR(code){

	//1. Bloga komandai
	//2. Blogos registrų reikšmės
    stop();
	$('#err').html(code);


	switch(code) {
        case 1:
            outPut("Bloga komanda", 0);
            break;
        case 2:
            outPut("ERROR:Komanda/Programa nerasta", 0);
            break;
        case 3:
            outPut("ERROR:Nėra įvesties duomenų", 0);
            break;
        case 4:
            outPut("Blogos registrų reikšmės", 0);
			break;
	    default:
			outPut("ERROR", 0);
	} 

}

function run(){

  /*code = $("#code").val(); //string.replace(/\d+/g, '')

  comad = code.split('\n');
  numas = 0;
     xx = 0;
	$.each(comad, function( index, value ) {
		if(xx > 1){ 
	  if($.isNumeric( value )){ putR(value); } else {	
	  if($.inArray(value.replace(/\d+/g, ''), comands) > -1){ execCom(value); } else { erroR("Blogas"); return; };
	}}
	xx++;
	});*/
    step();

}

/*********************************************
 * stop VM interupt
 **********************************************/
function stop(){


    $('#mode').html(1);
    //$("#terminal").val('');
    $('#pcv').html(00);
    $('#rv').html(0000);
    $('#nr').html(0);
}


/*********************************************
 * Run code by step
 **********************************************/
function step(){
    $('#err').html(0);
	nr = parseInt($('#nr').html());
	
	//vm iniciacija atminties puslapio priskirimas
	if(!nr){ nr = parseInt($('#ptr').html())+1; $('#ptr').html(nr); $('#nr').html(nr);  }



    //$('#ti').html(parseInt($('#ti').html())+1);
    //incTI();
    $('#mode').html(0);

    if(checkData() == 0){

    	return 0;

	}
	loadSuper();


    // VM ir programos vykdymas is super
	term = $('#terminal').val()
	$('#terminal').val(term + "\n");

	ramstart = ds;
    progstart = 0;
    go = 1
	xc = 1
    swich = 0
     while(go == 1){

    	coma = getVal(xc, 'super');
		//console.log(coma)

        if(coma == 'STAR'){ swich = 1; }


    	if(swich == 1){ if(coma != 'STAR'){ incTI(); execCom(coma); } }
    	 else
    	     { putVatTable(coma, xc, 'rram') }

    	xc++;
    	if(coma == 'KILL'){ go = 0; }

    	//sinchronizuojame viska
    	syncData();

	 }


}

function execCom(coma){

	com = coma.replace(/\d+/g, '');
	num = coma.replace(com, '');
	nr = parseInt(num);
	vv = getVal(num, 'rram');

    //console.log(com);
    // console.log(nr);
      /*console.log(vv);*/


	switch(com) {
	    case "PR":
		putR(pad(vv, 4));
		console.log('Put to R: '+vv);
		break;
	    case "PS":
		//getVatTable(vv, ds+num, "rram", 0);
		putVatTable(parseInt(getR()), nr, "rram");
        console.log('From R  to Memory:'+nr);
		break;
	    case "AD":
		on = parseInt(getR());
		tw = parseInt(getVal(nr, "rram"));
		putR(pad((on+tw), 4));
        console.log('AD command:'+on+' '+tw+' = '+getR());
		break;
	    case "MN":
		on = parseInt(getR());
		tw = parseInt(getVal(nr, "rram"));
		putR(pad((on-tw), 4));
        console.log('MN command:'+on+' '+tw+' = '+getR());
		break;
	    case "ML":
		on = parseInt(getR());
		tw = parseInt(getVal(nr, "rram"));
		putR(pad((on*tw), 4));
        console.log('ML command:'+on+' '+tw+' = '+getR());
		break;
	    case "PD":
		outPut(getVal(nr, "rram"), 0);

		console.log('next:'+getVal(nr, "rram"));
		break;
	    case "KILL":
		putVal("001", "prtr");
		putVal("1", "mode");
		stop();
		break;
	    default:
		outPut("some error", 0);
	}

}

//put value to memmory
// vv - value
// nr - row
// table id
function putVatTable(vv, nr, id){ 

	data = pad(vv, 5);
	
	for (i = 1; i < data.length; i++) {
    	$('#'+id).find('tr').eq(nr).find('td').eq(i).html(data[i].toUpperCase());
	}
	
	}

function getVatTable(vv, nr, id, ret = 0){

    num = '';

    for (i = 1; i < data.length; i++) {
        num = num + $('#'+id).find('tr').eq(nr).find('td').eq(i+1).html();
    }
    if(ret){ return num; } else { putR(num); }
}

function getVal(nr, id){

    num = '';

    for (i = 0; i < 4; i++) {
        num = num + $('#' + id).find('tr').eq(nr).find('td').eq(i + 1).html();
    }
    return num;
}

function putVal(vv, id){
	
  $("#"+id).html(vv);	
	
	}

function putR(rv){ //alert('putr: '+rv);

    rv = '0'+rv;
    var rln = rv.length;
    var strt = rln - 4; // console.log(strt + ' ' + rv.length);
    var txt = rv.slice(strt, rv.length)
  putVal(txt, "r");
}

function getR(){
  return $("#r").html();
}

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
	
// iniciacija	
$(document).ready(function(e) {
    
	createTable(rams, 4, 'ram', 'rm', 'RAM');
	createTable(rrams, 4, 'rram', 'rm', 'REAL RAM');
	createTable(supers, 4, 'super', 'rm', 'SUPER');

	$("#code").val(example1);
//	$("#code").val(example2);

    $("#run").click(function() {
        run();
    });

    $("#step").click(function() {
        step();
    });

});	

//technines funkcijos
$(window).bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta > 0)
    {
		
		$('.scroll table').each(function() {
			tt = parseInt($(this).css('top'));
			$(this).css('top', (tt+50) + 'px');
		});
		
		/*tt = parseInt($('table#ram').css('top'));
		$('table#ram').css('top', (tt+50) + 'px');*/
    }
    else
    {
		$('.scroll table').each(function() {
			tt = parseInt($(this).css('top'));
			$(this).css('top', (tt-50) + 'px');
		});
    }
});

$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};

// other code
$( function() {
    $( "#tabs" ).tabs();
} );