/***************************************
 Standard Chinese Academy
 Website

 Main scripts

 @file: main.js
 ***************************************/
 
//--------------------------
// Helper methods
//--------------------------

function displayHiddenSentences() {
    console.log("Displaying hidden sentences...");
    console.log("Container: ", $("#showmore_container"));
    var hidden = $(".hidden_sentence");
    hidden.slice(0,6).each(function(){
        $(this).removeClass("hidden_sentence");
    });

    if ($(".hidden_sentence").length == 0) {
        $("#showmore_container").find("button").css("display","none");
    }
}

function togglePinyin(){
    console.log("toggling");
    $("ruby").toggleClass("hidePinyin");
    $("rt").toggleClass("hidePinyin");

    localStorage.setItem("scaShowPinyin", !(localStorage.getItem("scaShowPinyin")=="true"));
    updateLabels();
}

function toggleTranslations(){
    $(".lemma_sentence_translation").toggleClass("hideTranslation");

    localStorage.setItem("scaShowTranslations", !(localStorage.getItem("scaShowTranslations")=="true"));
    updateLabels();
}

function toggleTooltips(){
    localStorage.setItem("scaShowTooltips", !(localStorage.getItem("scaShowTooltips")=="true"));

    if (localStorage.getItem("scaShowTooltips")=="true") {
        $(".wordlink").tooltipster("enable");
    }
    else {
        $(".wordlink").tooltipster("disable");
    }
    updateLabels();
}

function updateLabels() {
    $("#pinyinToggle").prop("checked",(localStorage.getItem("scaShowPinyin")=="true"));
    $("#translationsToggle").prop("checked",(localStorage.getItem("scaShowTranslations")=="true"));
    $("#tooltipsToggle").prop("checked",(localStorage.getItem("scaShowTooltips")=="true"));
}

function setDictLang(lang) {
    localStorage.setItem("scaDictLang",lang);

    if (lang=="Chinese") {
        $(".flag.en").removeClass("active");
        $(".flag.zh").addClass("active");
        $(".js-typeahead").attr("placeholder","Search in Chinese; pinyin or simplified...");
        $(".js-typeahead").removeClass("english").addClass("chinese");
    }
    else {
        $(".flag.en").addClass("active");
        $(".flag.zh").removeClass("active");
        $(".js-typeahead").attr("placeholder","Search in English...");
        $(".js-typeahead").removeClass("chinese").addClass("english");
    }
}

function resetTypeahead() {
    window.typea.hideLayout();
    window.typea.resetLayout();
    if ($(".js-typeahead").val()!="") {
        window.typea.searchResult(); 
        window.typea.buildLayout(); 
        window.typea.showLayout();
    }
}

function simpleTemplating(data) {
    var html = '';
    $.each(data, function(index, item){
        html += `<a href="grammar/${item.plink}" class="tile hsk${item.level}bd">`;
        html += `<div>`;
        html +=     `<img src="/images/${item.image}"/>`;//<div class="grammar_point_pattern">P/N + 的 + N</div>`;//`<img src="/images/gr1.jpg"/>`;
        html +=     `<div class="tile_caption">${item.title}</div>`;
        html += `</div>`;
        html += `</a>`;
    });
    return html;
}

function repaginate(src) {
    if (window.paginationOn) {
        $('.pagination').pagination("destroy");
    }
    $('.pagination').pagination({
        dataSource: src,
        pageSize: 9,
        callback: function(data, pagination) {
            var html = simpleTemplating(data);
            $('#grammar_points_container').html(html);
        }
    });
    window.paginationOn = true;
    console.log("HERE");
}

function filterPointsByLevel(sender) {
    var accepted = [];
    if ($("#hsk1filter input")[0].checked) { accepted.push(1); }
    if ($("#hsk2filter input")[0].checked) { accepted.push(2); }
    if ($("#hsk3filter input")[0].checked) { accepted.push(3); }
    if ($("#hsk4filter input")[0].checked) { accepted.push(4); }
    if ($("#hsk5filter input")[0].checked) { accepted.push(5); }
    if ($("#hsk6filter input")[0].checked) { accepted.push(6); }

    if (accepted.length==0) {
        $(`#hsk${sender}filter input`).prop("checked",true);

        if ($("#hsk1filter input")[0].checked) { accepted.push(1); }
        if ($("#hsk2filter input")[0].checked) { accepted.push(2); }
        if ($("#hsk3filter input")[0].checked) { accepted.push(3); }
        if ($("#hsk4filter input")[0].checked) { accepted.push(4); }
        if ($("#hsk5filter input")[0].checked) { accepted.push(5); }
        if ($("#hsk6filter input")[0].checked) { accepted.push(6); }
    }

    console.log(accepted);

    var filtered = window.gpoints.filter(function(gpoint){
        return accepted.includes(gpoint.level);
    });

    console.log(filtered);

    repaginate(filtered);
}

function changeTab(sender,tabElement) {
    if (!sender.hasClass("active")) {
        $(".tab_item").removeClass("active");
        sender.addClass("active");

        $(".tab").addClass("inactive");
        console.log(tabElement);
        tabElement.removeClass("inactive");
    }
}

function adjustAudioClips() {
    $(".audioclip").on('click', function(){
        var lemma = $(this).attr("sca-lemma")
        if ($(`#audio-${lemma}`).length==0) {
            $("body").append(`<audio id='audio-${lemma}'><source src='/audio/words/${lemma}.mp3' type='audio/mp3' /></audio>`);
            $(`#audio-${lemma}`)[0].autoplay = true;

            $(`#audio-${lemma}`).on('playing', function() {
                $(`.audioclip[sca-lemma='${lemma}']`).find("span").removeClass("lnr-volume-medium");
                $(`.audioclip[sca-lemma='${lemma}']`).find("span").addClass("lnr-volume-high");
                $(`.audioclip[sca-lemma='${lemma}']`).toggleClass("playing");
            });
            $(`#audio-${lemma}`).on('ended', function() {
                $(`.audioclip[sca-lemma='${lemma}']`).find("span").removeClass("lnr-volume-high");
                $(`.audioclip[sca-lemma='${lemma}']`).find("span").addClass("lnr-volume-medium");
                $(`.audioclip[sca-lemma='${lemma}']`).toggleClass("playing");
                console.log($(this));
                console.log("looking for: " + `#audio-${lemma}`);
                $(`#audio-${lemma}`)[0].autoplay = false;
            });
        }
        else {
            if (!$(`.audioclip[sca-lemma='${lemma}']`).hasClass('playing')) {
                $(`#audio-${lemma}`)[0].play(); 
            }    
        }
    });
}

function resetBreadcrumbs(items) {
    var content = `<li><a href="/"><span class="lnr lnr-home"></span></a></li>`;
    for (var i=0; i<items.length; i++) {
        content += `<li>`;

        if (i!= items.length-1) {
            content += `<a href="#">`;
        }

        content += items[i];

        if (i!= items.length-1) {
            content += `</a>`;
        }
        
        content += `</li>`;

        $("#breadcrumbs_wrapper").html(content);
    }
}

function processWordlinks(){
    $('[sca-link]').each(function(){
        $(this).wrap(`<a href="http://localhost:4567/dictionary/chinese-english/${$(this).attr("sca-link")}" class="wordlink"></a>`);
    });

    $('.wordlink').tooltipster({
        theme: 'tooltipster-noir',
        maxWidth: 300,
        side: 'bottom',
        content: 'Loading...',
        contentAsHTML: true,
        animation: 'grow',
        delay: 500,
        updateAnimation: 'scale',
        interactive: true,
        animationDuration: 200,
        functionBefore: function(instance, helper) {
            var $origin = $(helper.origin);
                  
            if ($origin.data('loaded') !== true) {
                $.get(instance._$origin.attr("href")+"?tooltip", function(data) {
                    instance.content(data);
                    $origin.data('loaded', true);
                });
            }
        }
    });
}

function annotateText() {
    $.post("/_/annotate", { text: $.trim($("#text-input").val()) })
     .done(function(data) {
        //console.log(JSON.parse(data)["e"]);
        var parsed = JSON.parse(data);
        var entries = parsed["e"];
        var res = "";
        for (var i=0; i<entries.length; i++){
            var trans = entries[i]["d"];
            if (trans=="") {
                trans = "&nbsp;";
            }
            var scalink = `sca-link='${entries[i]["w"]}'`;
            if (trans=="&nbsp;") {
                scalink = "";
            }
            res += "<span class='annotated-word'>";
                res += `<ruby ${scalink}>${entries[i]["w"]}<rt>${entries[i]["p"]}</rt></ruby>`;
                res += `<span class='translation'>${trans}</span>`;
            res += "</span>";
        }
        $("#annotator-result").html(res);
        $("#annotator-result").addClass(`hsk${parsed["h"]}bd`);
        $("#annotator-result").css("visibility","visible");
        processWordlinks();
    });
}

function convertText() {
    var convertTo = 'simplified';
    console.log($("#convertToSimplified:checked").val());
    if ($("#convertToSimplified:checked").val() != "on") {
        convertTo = 'traditional';
    }  
    $.post("/_/convert", { 
        text: $.trim($("#text-input").val()),
        to: convertTo
     })
     .done(function(data) {
        //console.log(JSON.parse(data)["e"]);
        console.log(`got: ${data}`);
        var parsed = JSON.parse(data);
        var res = "";
        res = parsed;

        $("#converter-result").html(res);
        //$("#converter-result").addClass(`hsk${parsed["h"]}bd`);
        $("#converter-result").css("visibility","visible");
        processWordlinks();
    });
}

//--------------------------
// Startup setup
//--------------------------

$(document).ready(function(){

    // Setup reading text popups

    $("[sca-trans]").mouseenter(function(){
        $("#text_trans").html("<b><span class='lnr lnr-direction-ltr'></span></b>&nbsp;" + $(this).attr("sca-trans"));
    });

    $("[sca-trans]").mouseleave(function(){
        $("#text_trans").html("<span style='color:#999;'>Hover over any sentence and see its automated translation here!</span>");
    });

    // Setup pagination
    
    if (typeof window.gpoints !== 'undefined') {
        repaginate(window.gpoints);
    }

    // Enable smooth scrolling

    var scroll = new SmoothScroll('a[href*="#"]', {
        offset: 75,
        speed: 400,
        speedAsDuration: true,
        durationMax: 500
    });

    // Activate scroll spy

    if($("nav.toc").length > 0) {
        var spy = new Gumshoe("nav.toc a", {
            navClass: "active",
            contentClass: "active",

            nested: false,
            nestedClass: "active",

            offset: 75,
            reflow: true,

            events: true
        });
    }

    // Enable wordlinks

    processWordlinks();

    // Enable other tooltips

    $('.tooltiped').tooltipster({
        delay: 500,
        theme: 'tooltipster-light'
    }); 

    // Enable events & animations for audio play buttons

    adjustAudioClips();

    // Set up language and options defaults

    $("#pinyinToggle").click(togglePinyin);
    $("#translationsToggle").click(toggleTranslations);
    $("#tooltipsToggle").click(toggleTooltips);

    if (localStorage.getItem("scaShowPinyin")==null) {
        localStorage.setItem("scaShowPinyin",true);
        localStorage.setItem("scaShowTranslations",true);
        localStorage.setItem("scaShowTooltips",true);
    }
    if (localStorage.getItem("scaShowPinyin")=="false") {
        $("ruby").toggleClass("hidePinyin");
        $("rt").toggleClass("hidePinyin");
    }
    if (localStorage.getItem("scaShowTranslations")=="false") {
        $(".translation").toggleClass("hideTranslation");
    }
    if (localStorage.getItem("scaShowTooltips")=="false") {
        $(".wordlink").tooltipster("disable");
    }
    if (localStorage.getItem("scaDictLang")==null) {
        localStorage.setItem("scaDictLang","Chinese");
    }

    // Get dictionary data and initialize search box

    $.ajax({
        type: "GET",
        url: "/_/indexes"
    }).done(function(response){
        var wordindex = JSON.parse(response);
        window.searchurl = {
            "Chinese": "/dictionary/chinese-english/",
            "English": "/dictionary/english-chinese/"
        };

        window.typea = $('.js-typeahead').typeahead({
            minLength: 1,
            maxItem: 50,
            dynamic: false,
            backdrop:false,
            generateOnLoad: false,
            order: null,
            offset: "true",
            matcher: function (item, displayKey) {
                return (item.group == localStorage.getItem("scaDictLang"));
            },
            display: ["w","u"],
            accent: false,
            asyncResult: true,
            group: false,
            source: {
                Chinese: {
                    template: '<div><span class="searchlemma"><strong class="hsk{{h}}fg">{{w}}</strong></span><span class="searchpinyin">{{p}}</span><div class="hskbadge mini is{{h}}"><div class="hsk">HSK</div><div class="level hsk{{h}}">{{h}}</div></div></div>',
                    data: wordindex["zh"]
                },
                English: {
                    template: '<div><span>{{w}}</span></div>',
                    data: wordindex["en"]
                }
            },
            callback: {
                onInit: function (node) {
                },
                onSearch: function (node, query) {
                },
                onReady: function (node) {
                    window.datasource = {
                        data: response
                    };
                    setDictLang(localStorage.getItem("scaDictLang"));
                },
                onDropdownFilter: function (node, a, item, event) {
                },
                onSubmit: function (node, form, item, event) {
                    if (item==null) {
                        var firstItem = $($(".typeahead__list li a span")[0]).text();
                        if (firstItem!=""){
                            window.location.href = window.searchurl[localStorage.getItem("scaDictLang")]+firstItem;
                        }
                    } 
                    else {
                    }
                    return false;
                },
                onClickAfter: function (node, a, item, event) {
                    window.location.href = window.searchurl[localStorage.getItem("scaDictLang")]+item.w
                },
                onLayoutBuiltAfter: function (node, query, result, resultCount, resultCountPerGroup) {
                    $('.typeahead__list').css("width",$('.typeahead__query').css("width"));
                }
            },
            emptyTemplate: [
                '<div class="empty-message">',
                'unable to find any entries that match your query',
                '</div>'
            ].join('\n')
        });
    });

    updateLabels();

    // Setup lazy image loading

    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    var lazyContents = [].slice.call(document.querySelectorAll(".lazyload"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    console.log("showing one image");
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        let lazyContentObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    console.log("showing content");
                    let lazyContent = entry.target;
                    $(lazyContent).load(lazyContent.dataset.src);
                    lazyContent.classList.remove("lazyload");
                    lazyContentObserver.unobserve(lazyContent);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });

        lazyContents.forEach(function(lazyContent) {
            lazyContentObserver.observe(lazyContent);
        });
    } else {
    
    }

    // Execute stack of OnLoad functions

    for (var i=0; i<window.onloadFunctions.length; i++) {
        onloadFunctions[i]();
    }

});
