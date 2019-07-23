
function getMunicipiosJson (callback) {
  $.getJSON("https://raw.githubusercontent.com/kleytonmr/ES-municipios/master/munic/banco.min.json?token=AHNGKJ76U73FCUWASQXOPAK5DHRMY",
    function (data) {
      callback(data.municipios);
    });
}

function initMunicipioSelect(data) {
  $('.cc-select-municipio').each(function() {
    var input = $(this);
    $(data).each(function(i, value){
      input.append($('<option>', { value: value.key, text: value.munic }));
    });
  });
}

function initClusterMap(idMunicipio) {

  var munic_current = idMunicipio
  if (!munic_current) return;

  // selectMunicipioOption(munic_current);
  // populeMunicipioData(munic_current);

  var buildMunicSelector = function (id) {
    return "#cluster-map g[data-municipio='" + id + "']";
  }

  getMunicipiosJson(function(data) {
    for (var i in data){
      $(buildMunicSelector(data[i].key)).css("fill", "#e7e8ea");
    }

    for (var i in data){
      $(buildMunicSelector(data[i].key)).css("fill", "#e7e8ea");
    }

    for (var i in data){
      if (data[i].key == munic_current) {
        for (var j in data){
          if (data[i].cluster == data[j].cluster) {
            $(buildMunicSelector(data[j].key)).css("fill", "#a1a1a1");
            $(buildMunicSelector(munic_current)).css("fill", "#ffba5a");
          }
        }
      }
    }
  });
}

function initFilterMap(idMunicipio) {
  var buildMunicSelector = function (id) {
    return "#filter-map g[data-municipio='" + id + "']";
  }

  var selectedValueRadio = $("input[name='options']:checked").val();
  var munic_current = idMunicipio;

  // selectMunicipioOption(munic_current);
  // populeMunicipioData(munic_current);
  getMunicipiosJson(function (data) {
    for (var i in data){
      $(buildMunicSelector(data[i].key)).css("fill", "#e7e8ea");
      $("#agrupamentos").find('li').remove()
    }

    for (var i in data){
      if (data[i].key == munic_current) {
        if(selectedValueRadio == "cluster"){
          for (var j in data){
            if (data[i].cluster == data[j].cluster) {
              $(buildMunicSelector(data[j].key)).css("fill", "#a1a1a1");
              $(buildMunicSelector(munic_current)).css("fill", "#ffba5a");
              $("#agrupamentos").append("<li>" + data[j].munic +": "+ data[j].cluster+ "</li>");
            }
          }
        }else if(selectedValueRadio == "regional"){
          for (var j in data){
            if (data[i].regional == data[j].regional) {
              $(buildMunicSelector(data[j].key)).css("fill", "#2d3091");
              $(buildMunicSelector(munic_current)).css("fill", "#ffba5a");
              $("#agrupamentos").append("<li>" + data[j].munic +": "+ data[j].regional+ "</li>");
            }
          }
        }else if(selectedValueRadio == "estadual"){
          for (var j in data){
            $(buildMunicSelector(data[j].key)).css("fill", "#a1a1a1");
            $(buildMunicSelector(munic_current)).css("fill", "#ffba5a");
          }
        }else{
          // alert("Escolha um grupo primeiro!")
        }
      }
    }
  });
}

function selectMunicipioOption(idMunicipio) {
  if (idMunicipio) {
    $(".cc-select-municipio").each(function (i, input) {
      getMunicipiosJson(function (data) {
        var result = data.find(obj => {
          return obj.key === idMunicipio
        });
        $(input).val(result.key);
      });
    });
  }
}

function populeMunicipioData(idMunicipio) {

  getMunicipiosJson(function(data) {
    var municipio = data.find(obj => {
      return obj.key === idMunicipio
    });

    if (municipio) {
      // $('img#mapa-json').attr("src","assets/img/mapa-cluster-" + municipio.key + ".png");
      populateMainRulerValues(municipio);

      var keys = Object.keys(municipio);

      $(keys).each(function (i, keyName) {
        buildCategoriesSliderRuler(keyName);
        var keyTerms = keyName.toString().split('_');
        if (keyTerms[0] === 'pr') {
          keyTerms.shift();
          keyTerms = keyTerms.join('_');
          setCategoriesSliderRuler(keyTerms, municipio);
        }
      });

      $(keys).each(function (i, name) {
        var value = municipio[name];
        if (isNumeric(value)) {
          $('#' + name).html(parseFloat(value).toFixed(2));
          var nValue = parseFloat(value).toFixed(1);
          var prefix = name.toString().split('_')[0];
          if (prefix === 'cpos'){
            nValue = parseInt(nValue).toString() + '\u00BA';
          }
          $('span[data-'+ name +']').html(nValue.replace(".", ","));
        } else {
          $('#' + name).html(value);
          if (name === 'munic'){
            $('span[data-municipio]').html(municipio.munic);
          }
        }
      });


      $("span[id*='ran_']").each(function (i, e) {
        $(this).text(parseInt($(e).text()));
      });
    }
  });
}

// Verifica a sessão atual do menu e pupula a regua pincipal.
function populateMainRulerValues(municipio) {

  var session = $('#menu-session').data('session');

  if (session === 'ian') {
    // TODO: Add variáveis texto ian
    setMainRuler(
      municipio.cmin_gestfin,
      municipio.cmed_gestfin,
      municipio.gestfin,
      municipio.cmax_gestfin
    )
  } else if (session === 'infraestrutura') {
    setMainRuler(
      municipio.cmin_infra,
      municipio.cmed_infra,
      municipio.infra,
      municipio.cmax_infra
    )
  } else if (session === 'pontecial de mercado' ) {
    setMainRuler(
      municipio.cmin_merc,
      municipio.cmed_merc,
      municipio.merc,
      municipio.cmax_merc
    )
  } else if (session === 'capital humano' ) {
    setMainRuler(
      municipio.cmin_caph,
      municipio.cmed_caph,
      municipio.caph,
      municipio.cmax_caph
    )
  } else if (session === 'gestão fiscal' ) {
    setMainRuler(
      municipio.cmin_gestfin,
      municipio.cmed_gestfin,
      municipio.gestfin,
      municipio.cmax_gestfin
    )
  }
}

// inicializa os valores da Regua principal
function setMainRuler(menorVal, medVal, municVal, maiorVal) {
  var mainslider = document.getElementById('main-slider');

  $('#menor-val-cl').text(parseFloat(menorVal).toFixed(1));
  $('#media-val-cl').text(parseFloat(medVal).toFixed(1));
  $('#munic-val-cl').text(parseFloat(municVal).toFixed(1));
  $('#maior-val-cl').text(parseFloat(maiorVal).toFixed(1));

  var vf_min = 0.5;
  var vf_max = 9.5;

  medVal   = parseFloat(medVal).toFixed(1);
  municVal = parseFloat(municVal).toFixed(1);

  var vf_med = (((medVal - menorVal) / (maiorVal - menorVal)) * 9 ) + 0.5;
  var vf_mun = (((municVal - menorVal) / (maiorVal - menorVal)) * 9 ) + 0.5;

  vf_med = parseFloat(vf_med).toFixed(1);
  vf_mun = parseFloat(vf_mun).toFixed(1);

  // console.log([vf_min, vf_med, vf_mun, vf_max]);
  mainslider.noUiSlider.set([vf_min, vf_med, vf_mun, vf_max]);
}

// valida valores numericos
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function setClusterMapSelected(idMunicipio) {
  var cluster = "#cluster-map g[data-municipio='" + idMunicipio + "']";
  $(cluster).click();
}

function setFilterMapSelected(idMunicipio) {
  var filter = "#filter-map g[data-municipio='" + idMunicipio + "']";
  $(filter).click();
}

function clickFilterMap(idMunicipio) {
  if (idMunicipio) {
    getMunicipiosJson(function(data) {
      var municipio = data.find(obj => {
        return obj.key === idMunicipio;
      });

      var selectedValueRadio = $("input[name='options']:checked").val();

      if (selectedValueRadio === 'cluster') {
        // cluster
        setClusterMapValues(municipio);
      } else if (selectedValueRadio === 'regional') {
        // regional
        setRegionalMapValues(municipio);
      } else {
        // estadual
        setEstadualMapValues(municipio);
      }
    });
  }
}

function setEstadualMapValues(municipio) {
  if (municipio) {
    $('#map-ian')         .html(parseFloat(municipio.med_ian,).toFixed(1));
    $('#ranking')         .html(parseInt(municipio.pos_ian,));
    $('#infra-ranking')   .html(parseInt(municipio.pos_ian,).toString() + '\u00BA');
    $('#infra-media')     .html(parseFloat(municipio.med_infra,).toFixed(1));
    $('#infra-pos')       .html(parseFloat(municipio.ian,).toFixed(1));
    $('#gfiscal-ranking') .html(parseInt(municipio.pos_ian,).toString() + '\u00BA');
    $('#gfiscal-media')   .html(parseFloat(municipio.med_gestfin,).toFixed(1));
    $('#gfiscal-pos')     .html(parseFloat(municipio.ian,).toFixed(1));
    $('#pmercado-ranking').html(parseInt(municipio.pos_ian,).toString() + '\u00BA');
    $('#pmercado-media')  .html(parseFloat(municipio.med_merc,).toFixed(1));
    $('#pmercado-pos')    .html(parseFloat(municipio.ian,).toFixed(1));
    $('#chumano-ranking') .html(parseInt(municipio.pos_ian,).toString() + '\u00BA');
    $('#chumano-media')   .html(parseFloat(municipio.med_caph,).toFixed(1));
    $('#chumano-pos')     .html(parseFloat(municipio.ian).toFixed(1));

    setMediaSliderRulers(
      municipio.med_infra,
      municipio.ian,
      municipio.med_gestfin,
      municipio.ian,
      municipio.med_merc,
      municipio.ian,
      municipio.med_caph,
      municipio.ian)
  }
}

function setRegionalMapValues(municipio) {
  if (municipio) {
    $('#map-ian')         .html(parseFloat(municipio.rpos_ian,).toFixed(1));
    $('#ranking')         .html(parseInt(municipio.regional,));
    $('#infra-ranking')   .html(parseInt(municipio.rpos_infra,).toString() + '\u00BA');
    $('#infra-media')     .html(parseFloat(municipio.rmed_infra,).toFixed(1));
    $('#infra-pos')       .html(parseFloat(municipio.infra,).toFixed(1));
    $('#gfiscal-ranking') .html(parseInt(municipio.rpos_gestfin,).toString() + '\u00BA');
    $('#gfiscal-media')   .html(parseFloat(municipio.rmed_gestfin,).toFixed(1));
    $('#gfiscal-pos')     .html(parseFloat(municipio.gestfin,).toFixed(1));
    $('#pmercado-ranking').html(parseInt(municipio.rpos_merc,).toString() + '\u00BA');
    $('#pmercado-media')  .html(parseFloat(municipio.rmed_merc,).toFixed(1));
    $('#pmercado-pos')    .html(parseFloat(municipio.merc,).toFixed(1));
    $('#chumano-ranking') .html(parseInt(municipio.rpos_caph,).toString() + '\u00BA');
    $('#chumano-media')   .html(parseFloat(municipio.rmed_caph,).toFixed(1));
    $('#chumano-pos')     .html(parseFloat(municipio.caph).toFixed(1));

    setMediaSliderRulers(
      municipio.rmed_infra,
      municipio.infra,
      municipio.rmed_gestfin,
      municipio.gestfin,
      municipio.rmed_merc,
      municipio.merc,
      municipio.rmed_caph,
      municipio.caph)
  }
}

function setClusterMapValues(municipio) {
  if (municipio) {
    $('#map-ian')         .html(parseFloat(municipio.ian,).toFixed(1));
    $('#ranking')         .html(parseInt(municipio.cpos_ian,));
    $('#infra-ranking')   .html(parseInt(municipio.cpos_infra,).toString() + '\u00BA');
    $('#infra-media')     .html(parseFloat(municipio.cmed_infra,).toFixed(1));
    $('#infra-pos')       .html(parseFloat(municipio.infra,).toFixed(1));
    $('#gfiscal-ranking') .html(parseInt(municipio.cpos_gestfin,).toString() + '\u00BA');
    $('#gfiscal-media')   .html(parseFloat(municipio.cmed_gestfin,).toFixed(1));
    $('#gfiscal-pos')     .html(parseFloat(municipio.gestfin,).toFixed(1));
    $('#pmercado-ranking').html(parseInt(municipio.cpos_merc,).toString() + '\u00BA');
    $('#pmercado-media')  .html(parseFloat(municipio.cmed_merc,).toFixed(1));
    $('#pmercado-pos')    .html(parseFloat(municipio.merc,).toFixed(1));
    $('#chumano-ranking') .html(parseInt(municipio.cpos_caph,).toString() + '\u00BA');
    $('#chumano-media')   .html(parseFloat(municipio.cmed_caph,).toFixed(1));
    $('#chumano-pos')     .html(parseFloat(municipio.caph).toFixed(1));

    setMediaSliderRulers(
      municipio.cmed_infra,
      municipio.infra,
      municipio.cmed_gestfin,
      municipio.gestfin,
      municipio.cmed_merc,
      municipio.merc,
      municipio.cmed_caph,
      municipio.caph)
  }
}

function setMediaSliderRulers(infra_media, infra_pos, pmercado_media, pmercado_pos, chumano_media, chumano_pos, gfiscal_media, gfiscal_pos) {
  var slider_infra_media = document.getElementById('slider_infra_media');
  slider_infra_media.noUiSlider.set([infra_media, infra_pos]);

  var slider_pmercado_media = document.getElementById('slider_pmercado_media');
  slider_pmercado_media.noUiSlider.set([pmercado_media, pmercado_pos]);

  var slider_chumano_media = document.getElementById('slider_chumano_media');
  slider_chumano_media.noUiSlider.set([chumano_media, chumano_pos]);

  var slider_gfiscal_media = document.getElementById('slider_gfiscal_media');
  slider_gfiscal_media.noUiSlider.set([gfiscal_media, gfiscal_pos]);
}

function buildMembrosCluster(idMunicipio) {
  if (idMunicipio) {
    getMunicipiosJson(function(data) {
      var selected = data.find(munic => {
        return munic.key === idMunicipio
      });
      var cClusters = data.map(function (munic) {
        if (munic.cluster === selected.cluster) {
          return munic;
        }
      }).filter(function(item) {
        return item != undefined
      });

      $('#membros-cluster').empty();
      var ul = document.createElement('ul');
      ul.classList.add('list-group', 'list-group-flush','row');
      $(cClusters).each(function(i,item) {
        var li = document.createElement('li');
        li.classList.add('list-group-item','col-md-6');
        $(li).html(item.munic);
        $(ul).append(li);
        $('#membros-cluster').append(ul);
      });
    });
  }
}

function populateTexts(data) {
  var municipioSelected = $(".cc-select-municipio").val();
  var municipio
  if (municipioSelected) {
    municipio = data.find(obj => {
      return obj.key === municipioSelected
    });
  } else {
    municipio = data[0];
  }

  var keys = Object.keys(municipio);
  $(keys).each(function (i, name) {
    $('.'+ name).html(municipio[name]);
  });

  var session = $('#menu-session').data('session');
  var texto1 = $('.texto1');
  var texto2 = $('.texto2');

  if (session === 'ian') {
    // TODO: Add variáveis texto ian
    texto1.html("municipio['texto1_ian']");
    texto2.html("municipio['texto2_ian']");
  }
  if (session === 'infraestrutura') {
    texto1.html(municipio['texto1_infra']);
    texto2.html(municipio['texto2_infra']);
  }
  if (session === 'pontecial de mercado') {
    texto1.html(municipio['texto1_potencial_de_mercado']);
    texto2.html(municipio['texto2_potencial_de_mercado']);
  }
  if (session === 'capital humano') {
    texto1.html(municipio['texto1_capital_humano']);
    texto2.html(municipio['texto2_capital_humano']);
  }
  if (session === 'gestão fiscal') {
    texto1.html(municipio['texto1_gestao_fiscal']);
    texto2.html(municipio['texto2_gestao_fiscal']);
  }
}

function buildCategoriesSliderRuler(keyName) {
  var slider = document.getElementById('slider_' + keyName);

  if (slider && !slider.classList.contains('noUi-target')) {

    noUiSlider.create(slider, {
      start: [0.0, 0.0],
      behaviour: 'unconstrained-tap',
      range: {
        'min': [0.0],
        'max': [10.0]
      }
    });

    slider.setAttribute('disabled', true);

    var media = document.createElement('span');
    media.innerHTML = "Média do Cluster";

    var municipio = document.createElement('span');
    municipio.innerHTML = "Vitória";
    municipio.setAttribute('data-municipio', 'Vitória');

    media.classList.add('cc-legenda-cluster', 'cc-cor-cinza');
    municipio.classList.add('cc-legenda-cluster', 'cc-cor-marrom', 'cc-municipio');

    var selector = '#slider_' + keyName + ' .noUi-handle';

    $($(selector)[0]).parent().prepend(media);
    $($(selector)[1]).parent().prepend(municipio);

    // TODO: remover indicadores fundo preto
    // $(selector).each(function () {
    //   this.style = 'background-color: black;';
    // });

    var mediaValor = document.createElement('span');
    mediaValor.id = "med_" + keyName;

    var municipioValor = document.createElement('span');
    municipioValor.id = keyName;

    mediaValor.classList.add('cc-valor', 'cc-color-cinza');
    municipioValor.classList.add('cc-color-marrom', 'cc-valor-municipio');

    $($(selector)[0]).parent().append(mediaValor);
    $($(selector)[1]).parent().append(municipioValor);
  }
}

function setCategoriesSliderRuler(keyName, objMunic) {
  var slider = document.getElementById('slider_' + keyName);
  if (slider) {
    var keyMedia = 'prm_' + keyName;
    var pr_keyName = 'pr_' + keyName;

    var medVal = objMunic[keyMedia];
    var municVal = objMunic[pr_keyName];

    medVal = parseFloat(medVal).toFixed(1);
    municVal = parseFloat(municVal).toFixed(1);

    slider.noUiSlider.set([medVal, municVal]);
  }
}

function buildMainSliderRuler() {
  var slider = document.getElementById('main-slider');

  noUiSlider.create(slider, {
    start: [2, 4, 6, 8],
    behaviour: 'unconstrained-tap',
    range: {
      'min': [0.0],
      'max': [10.0]
    }
  });

  slider.setAttribute('disabled', true);

  var menor = document.createElement('span');
  menor.innerHTML = "Menor do Cluster";

  var media = document.createElement('span');
  media.innerHTML = "Média do Cluster";

  var municipio = document.createElement('span');
  municipio.innerHTML = "Vitoria";
  municipio.setAttribute('data-municipio', 'Vitoria');

  var maior = document.createElement('span');
  maior.innerHTML = "Maior do Cluster";

  menor.classList.add('cc-legenda-cluster', 'cc-cor-roxo');
  media.classList.add('cc-legenda-cluster', 'cc-cor-cinza');
  municipio.classList.add('cc-legenda-cluster', 'cc-cor-marrom', 'cc-municipio');
  maior.classList.add('cc-legenda-cluster', 'cc-cor-roxo');

  var selector = '#main-slider .noUi-handle';

  $($(selector)[0]).parent().prepend(menor);
  $($(selector)[1]).parent().prepend(media);
  $($(selector)[2]).parent().prepend(municipio);
  $($(selector)[3]).parent().prepend(maior);

  var menorValor = document.createElement('span');
  menorValor.innerHTML = "0,0";
  menorValor.id = "menor-val-cl";

  var mediaValor = document.createElement('span');
  mediaValor.innerHTML = "0,0";
  mediaValor.id = "media-val-cl";

  var municipioValor = document.createElement('span');
  municipioValor.innerHTML = "0,0";
  municipioValor.id = "munic-val-cl";

  var maiorValor = document.createElement('span');
  maiorValor.innerHTML = "0,0";
  maiorValor.id = "maior-val-cl";

  menorValor.classList.add('cc-valor', 'cc-color-roxo');
  mediaValor.classList.add('cc-valor', 'cc-color-cinza');
  municipioValor.classList.add('cc-valor', 'cc-color-marrom', 'cc-valor-municipio');
  maiorValor.classList.add('cc-valor', 'cc-color-roxo');

  $($(selector)[0]).parent().append(menorValor);
  $($(selector)[1]).parent().append(mediaValor);
  $($(selector)[2]).parent().append(municipioValor);
  $($(selector)[3]).parent().append(maiorValor);
}

function buildMediaSliderRulers() {
  var sliderIds = [
    'slider_infra_media',
    'slider_pmercado_media',
    'slider_chumano_media',
    'slider_gfiscal_media'
  ]

  $(sliderIds).each(function (i, id) {
    var slider = document.getElementById(id);

    noUiSlider.create(slider, {
      start: [3.5, 6.5],
      behaviour: 'unconstrained-tap',
      range: {
        'min': [0.0],
        'max': [10.0]
      }
    });

    slider.setAttribute('disabled', true);

    var media = document.createElement('span');
    media.innerHTML = "Média do Cluster";

    var municipio = document.createElement('span');
    municipio.innerHTML = "Vitória";
    municipio.setAttribute('data-municipio', 'Vitória');

    media.classList.add('cc-legenda-cluster', 'cc-cor-cinza');
    municipio.classList.add('cc-legenda-cluster', 'cc-cor-marrom', 'cc-municipio');

    var selector = '#' + id + ' .noUi-handle';

    $($(selector)[0]).parent().prepend(media);
    $($(selector)[1]).parent().prepend(municipio);

    var mediaValor = document.createElement('span');
    var municipioValor = document.createElement('span');

    switch (id) {
      case 'slider_infra_media':
        mediaValor.id = "infra-media";
        municipioValor.id = "infra-pos";
        break;
      case 'slider_pmercado_media':
        mediaValor.id = "pmercado-media";
        municipioValor.id = "pmercado-pos";
        break;
      case 'slider_chumano_media':
        mediaValor.id = "chumano-media";
        municipioValor.id = "chumano-pos";
        break;
      case 'slider_gfiscal_media':
        mediaValor.id = "gfiscal-media";
        municipioValor.id = "gfiscal-pos";
        break;
    }

    mediaValor.classList.add('cc-valor', 'cc-color-cinza');
    municipioValor.classList.add('cc-valor', 'cc-color-marrom', 'cc-valor-municipio');

    $($(selector)[0]).parent().append(mediaValor);
    $($(selector)[1]).parent().append(municipioValor);
  });

}

$(document).ready(function() {
  var inputSelectMunicipio = $(".cc-select-municipio");
  buildMainSliderRuler();
  buildMediaSliderRulers();
  getMunicipiosJson(initMunicipioSelect);
  getMunicipiosJson(populateTexts);

  inputSelectMunicipio.on('change', function () {
    var that = $(this)
    inputSelectMunicipio.each(function (i, input) {
      $(input).val(that.val());
    });
    setClusterMapSelected(that.val());
    setFilterMapSelected(that.val());
    buildMembrosCluster(that.val());
    selectMunicipioOption(that.val());
    populeMunicipioData(that.val());
  });

  $("g[data-municipio]").on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    var munic_current = $(this).data("municipio");
    initClusterMap(munic_current);
    initFilterMap(munic_current);
    clickFilterMap(munic_current);
    buildMembrosCluster(munic_current);
    selectMunicipioOption(munic_current);
    populeMunicipioData(munic_current);
  });

  $(".cc-custom-radio").on('click', function () {
    setFilterMapSelected(inputSelectMunicipio.val())
  });

  $('a[data-toggle="pill"]').on('click', function (e) {
    var idMunicipio = inputSelectMunicipio.val();
    populeMunicipioData(idMunicipio);
    getMunicipiosJson(populateTexts);
  });

  setTimeout(function () {
    inputSelectMunicipio.val('vitoria');
    populeMunicipioData('vitoria');
    setClusterMapSelected('vitoria');
    setFilterMapSelected('vitoria');
    buildMembrosCluster('vitoria');
  }, 1000);
});


// ---------------------- Old js

$(document).on('click', '.button-js', function(event) {
  $(this).find(".minus").toggle();
  $(this).find(".plus").toggle();
  $(this).parent().find(".descricao").toggleClass("descricao-show");
});

$(document).on('click', '.button-categorias', function(event) {
  $(this).find(".minus").toggle();
  $(this).find(".plus").toggle();
  $(this).parent().parent().find(".categoria").toggleClass("categoria-show");
});

$(document).on('click', '.button-cluster', function(event) {
  $(this).find(".minus").toggle();
  $(this).find(".plus").toggle();
  $(this).parent().parent().find(".cluster-content").toggleClass("cluster-content-show");
});

$(document).on('click', '.button-cases', function(event) {
  $(this).find(".minus").toggle();
  $(this).find(".plus").toggle();
  $(this).parent().find(".more").toggleClass("show-more");
});

$(document).on('click', '#card-potencialMercado', function(event) {
$("#content-potencialMercado").show();
$("#content-capitalHumano").hide();
$("#content-gestaoFiscal").hide();
$("#content-infraEstrutura").hide();

$("#card-potencialMercado").removeClass("active");
$("#card-capitalHumano").removeClass("active");
$("#card-gestaoFiscal").removeClass("active");
$("#card-infraEstrutura").removeClass("active");
$(this).addClass("active");

});

$(document).on('click', '#card-capitalHumano', function(event) {
$("#content-capitalHumano").show();
$("#content-potencialMercado").hide();
$("#content-gestaoFiscal").hide();
$("#content-infraEstrutura").hide();

$("#card-potencialMercado").removeClass("active");
$("#card-capitalHumano").removeClass("active");
$("#card-gestaoFiscal").removeClass("active");
$("#card-infraEstrutura").removeClass("active");
$(this).addClass("active");

});

$(document).on('click', '#card-gestaoFiscal', function(event) {
$("#content-gestaoFiscal").show();
$("#content-potencialMercado").hide();
$("#content-capitalHumano").hide();
$("#content-infraEstrutura").hide();
$("#card-potencialMercado").removeClass("active");
$("#card-capitalHumano").removeClass("active");
$("#card-gestaoFiscal").removeClass("active");
$("#card-infraEstrutura").removeClass("active");
$(this).addClass("active");

});

$(document).on('click', '#card-infraEstrutura', function(event) {
  $("#content-infraEstrutura").show();
  $("#content-potencialMercado").hide();
  $("#content-gestaoFiscal").hide();
  $("#content-capitalHumano").hide();
  $("#card-potencialMercado").removeClass("active");
  $("#card-capitalHumano").removeClass("active");
  $("#card-gestaoFiscal").removeClass("active");
  $("#card-infraEstrutura").removeClass("active");
  $(this).addClass("active");

});

$(document).on('click', '#radio #option1', function(event) {
  $("label#label1").addClass("active");
  $("label#label2").removeClass("active");
  $("label#label3").removeClass("active");
});

$(document).on('click', '#radio #option2', function(event) {
  $("label#label2").addClass("active");
  $("label#label1").removeClass("active");
  $("label#label3").removeClass("active");
});

$(document).on('click', '#radio #option3', function(event) {
  $("label#label3").addClass("active");
  $("label#label2").removeClass("active");
  $("label#label1").removeClass("active");
});

$(document).on('click', '.button-js', function(event) {
    $(this).find(".minus").toggle();
    $(this).find(".plus").toggle();
    $(this).parent().find(".descricao").toggleClass("descricao-show");
});

$(document).on('click', '.button-categorias', function(event) {
    $(this).find(".minus").toggle();
    $(this).find(".plus").toggle();
    $(this).parent().parent().find(".categoria").toggleClass("categoria-show");
});

$(document).on('click', '.button-cluster', function(event) {
    $(this).find(".minus").toggle();
    $(this).find(".plus").toggle();
    $(this).parent().parent().find(".cluster-content").toggleClass("cluster-content-show");
});

$(document).on('click', '.button-cases', function(event) {
    $(this).find(".minus").toggle();
    $(this).find(".plus").toggle();
    $(this).parent().find(".more").toggleClass("show-more");
});

$(document).on('click', '#card-potencialMercado', function(event) {
  $("#content-potencialMercado").show();
  $("#content-capitalHumano").hide();
  $("#content-gestaoFiscal").hide();
  $("#content-infraEstrutura").hide();

  $("#card-potencialMercado").removeClass("active");
  $("#card-capitalHumano").removeClass("active");
  $("#card-gestaoFiscal").removeClass("active");
  $("#card-infraEstrutura").removeClass("active");
  $(this).addClass("active");

});

$(document).on('click', '#card-capitalHumano', function(event) {
  $("#content-capitalHumano").show();
  $("#content-potencialMercado").hide();
  $("#content-gestaoFiscal").hide();
  $("#content-infraEstrutura").hide();

  $("#card-potencialMercado").removeClass("active");
  $("#card-capitalHumano").removeClass("active");
  $("#card-gestaoFiscal").removeClass("active");
  $("#card-infraEstrutura").removeClass("active");
  $(this).addClass("active");

});

$(document).on('click', '#card-gestaoFiscal', function(event) {
  $("#content-gestaoFiscal").show();
  $("#content-potencialMercado").hide();
  $("#content-capitalHumano").hide();
  $("#content-infraEstrutura").hide();
  $("#card-potencialMercado").removeClass("active");
  $("#card-capitalHumano").removeClass("active");
  $("#card-gestaoFiscal").removeClass("active");
  $("#card-infraEstrutura").removeClass("active");
  $(this).addClass("active");

});

$(document).on('click', '#card-infraEstrutura', function(event) {
  $("#content-infraEstrutura").show();
  $("#content-potencialMercado").hide();
  $("#content-gestaoFiscal").hide();
  $("#content-capitalHumano").hide();
  $("#card-potencialMercado").removeClass("active");
  $("#card-capitalHumano").removeClass("active");
  $("#card-gestaoFiscal").removeClass("active");
  $("#card-infraEstrutura").removeClass("active");
  $(this).addClass("active");

});


$(document).on('click', '#radio #option1', function(event) {
    $("label#label1").addClass("active");
    $("label#label2").removeClass("active");
    $("label#label3").removeClass("active");
});

$(document).on('click', '#radio #option2', function(event) {
    $("label#label2").addClass("active");
    $("label#label1").removeClass("active");
    $("label#label3").removeClass("active");
});

$(document).on('click', '#radio #option3', function(event) {
    $("label#label3").addClass("active");
    $("label#label2").removeClass("active");
    $("label#label1").removeClass("active");
});
