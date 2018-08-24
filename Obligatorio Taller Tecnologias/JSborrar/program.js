var marker;
var map;
var infoWindow;
$(document).ready(function(){
      initMap();
      getUbicaciones();

});



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.960159, lng:-54.942453},
    zoom: 14
  });
  google.maps.event.addListener(map, 'click', function(event) {

      mouseLocation = event.latLng;
      placeMarker(mouseLocation,map);
});
return map;
}

function placeMarker(location, map){
  if(marker){
    marker.setPosition(location);
  }else{
      marker = new google.maps.Marker({
      position : location,
      map: map,
      draggable : true

    });
  }


  document.getElementById("txtLat").value = marker.getPosition().lat();
  document.getElementById("txtLon").value = marker.getPosition().lng();
  google.maps.event.addListener(marker,'dragend',function(){
    var lat = marker.getPosition().lat();
    var lon = marker.getPosition().lng();
    $('#txtLat').val(lat);
    $('#txtLon').val(lon);
  });
}


function getUbicaciones()
{
  $.ajax({
     type: "GET",
     url: "http://localhost:8060/api/ubicacion",
     success: function(data){
        var ubicaciones = data.ubicaciones;

        var tblBody = document.getElementById("tblBody");
        tblBody.innerHTML = "";
        for(var i = 0; i<ubicaciones.length; i++)
        {

          tblBody.innerHTML += "<tr class='yeaboi' id="+i+" hidden><td>"+ubicaciones[i].nombre+"</td><td>"+ubicaciones[i].descripcion+"</td><td>"+ubicaciones[i].tipo+"</td><td>"+ubicaciones[i].latitud+"</td><td>"+ubicaciones[i].longitud+"</td><td><input type='button' value='ActualizameAmeo' onclick='ActualizarUbicacion(\""+ubicaciones[i]._id+"\")'/><input type='button'value='BorramePerro' onclick='BorrarUbicacion(\""+ubicaciones[i]._id+"\")'></input></td></tr>";



          var marcador = new google.maps.Marker({
            position :{
              lat: parseFloat(ubicaciones[i].latitud),
              lng: parseFloat(ubicaciones[i].longitud)
            },
            map : map,
            draggable:true,
            ubicacion : ubicaciones[i],
            lugar : i,
            contenido : '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ubicaciones[i].nombre+'</h1>'+
            '<div id="bodyContent">'+
            '<p>'+ ubicaciones[i].descripcion +'</p>'+
            '</div>'+
            '</div>'
          });
          ActualizarPosicion(marcador);
          bindInfoWindow(marcador,map,infoWindow,marcador.contenido);
        }


     },
     error: function(data)
     {

     }
   })
}


function BorrarUbicacion(idubic){
  var id = {idubic:idubic}
  $.ajax({
  type:"DELETE",
  data:JSON.stringify(id),
  contentType:'application/json',
  url:"http://localhost:8060/api/wsDeleteUbicacion",
  success:function(data){
    alert("todo bien");
    getUbicaciones();
  },
  error:function(data){
alert("todo mal");
  }
})
initMap();
}

function ActualizarUbicacion(idubic){
  var ubicacion = {
    nombre : $("#txtNombre").val(),
    descripcion : $("#txtDescripcion").val(),
    tipo : $("#txtTipo").val(),
    latitud : $("#txtLat").val(),
    longitud : $("#txtLon").val(),
  }
  var ubic = {
    ubicacion : ubicacion,
    idubic : idubic
  }
  $.ajax({
  type:"PUT",
  data:JSON.stringify(ubic),
  contentType:'application/json',
  url:"http://localhost:8060/api/wsUpdateUbicacion",
  success:function(data){
    alert("todo bien");
    getUbicaciones();
  },
  error:function(data){
alert("todo mal");
  }
})
initMap();
}


function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
}

function CenterMap(lat,lon){
  map.setCenter({
    lat : lat,
    lng : lon
  })
  //$("#txtLat").val(lat);
  //$("#txtLon").val(lon);
}

function ActualizarPosicion(marker){
  google.maps.event.addListener(marker,'dragend',function(){
    $(".yeaboi").hide();
    $("#"+this.lugar).show();
    var lat = marker.getPosition().lat();
    var lon = marker.getPosition().lng();
    $('#txtLat').val(lat);
    $('#txtLon').val(lon);
});
}
