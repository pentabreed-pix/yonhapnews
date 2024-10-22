var frontCommon = frontCommon || {};
frontCommon.Html = (function () {
    var instance = null;
    function init() {
        instance = {
        reset: function () {
            frontCommonResize();
            header();
            quickMenuUI();
            dropdown();
            },
        };
    return instance;
    }
    if (instance) {
        return instance;
    } else {
        return init();
    }
})();

function frontCommonResize() {
    window.addEventListener("resize", () => {

    });
}

function frontCommonScroll() {
    window.addEventListener("scroll", () => {

    });
}

function header() {
    let lastScrollTop = 0;
    const delta = 15;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if(!ticking) {
            window.requestAnimationFrame(function(){
                handleScroll();
                ticking = false;
            })
            ticking = true;
        }
    })

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop) {
            document.getElementById('header').classList.add('active');
        } else if (scrollTop < lastScrollTop) {
            document.getElementById('header').classList.remove('active');
        }

        lastScrollTop = scrollTop;
    }
}

function quickMenuUI() {
    var el = $('.quick-nav');
    var quickMenu = $('.nav-list');

    if (el.length <= 0) {
        return;
    }

    var ignoreScroll = false;
    var scrollOffset = 400; // 스크롤 이벤트에서 사용할 오프셋
    var clickOffset = 200; // 클릭 이벤트에서 사용할 오프셋

    var firstSection = $('[data-link-cont]').first();
    var firstDataLink = firstSection.attr('data-link-cont');
    if (firstDataLink) {
        quickMenu.find('.nav-item .anchor[data-link="' + firstDataLink + '"]').addClass('active');
        el.find('.nav-list .nav-item').removeClass('active');
        el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item').addClass('active');
        activateClosestTerm(el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item'));
    }

    $(window).off('scroll.scrollQuick').on('scroll.scrollQuick', function() {
        if (ignoreScroll) {
            return; // ignoreScroll이 true이면 스크롤 이벤트를 무시
        }

        var sct = $(this).scrollTop();
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();
        var isAtBottom = sct + windowHeight >= documentHeight - 10; // 페이지 끝에 거의 도달했는지 확인

        el.find('.nav-list .nav-item').each(function(idx, obj) {
            var dataLink = $(obj).find('a').attr('data-link');
            var targetSection = $('[data-link-cont="' + dataLink + '"]');
            
            if (targetSection.length > 0 && sct >= targetSection.offset().top - scrollOffset) {
                el.find('.nav-list .nav-item').removeClass('active');
                $(obj).addClass('active');
                activateClosestTerm($(obj));
            }
        });

        if (isAtBottom) {
            el.find('.nav-list .nav-item').removeClass('active');

            var lastItem = el.find('.nav-list .nav-item').last();
            lastItem.addClass('active');
            
            activateClosestTerm(lastItem);
        }

        var boxName = el.find('.nav-list').find('.nav-item.active').find('a').attr('data-link');
        
        quickMenu.find('.nav-item .anchor').removeClass('active');
        quickMenu.find('.nav-item .anchor[data-link="' + boxName + '"]').addClass('active');
    }).trigger('scroll.scrollQuick');

    quickMenu.find('a').on('click', function(e) {
        e.preventDefault();

        ignoreScroll = true; // 클릭 시 스크롤 무시 시작

        var dataType = $(this).attr('data-link');
        var targetSection = $('[data-link-cont="' + dataType + '"]');

        if (targetSection.length > 0) {
            var posMove = targetSection.offset().top - clickOffset; // 클릭 시 사용할 오프셋

            quickMenu.find('.nav-item .anchor').removeClass('active');
            quickMenu.find('.nav-item .anchor[data-link="' + dataType + '"]').addClass('active');

            el.find('.nav-list .nav-item').removeClass('active');
            $(this).closest('.nav-item').addClass('active');
            activateClosestTerm($(this).closest('.nav-item'));

            $('body, html').stop().animate({
                scrollTop: posMove
            }, function() {
                ignoreScroll = false; // 애니메이션이 완료된 후에 스크롤을 다시 활성화
            });
        } else {
            // console.error('해당 섹션을 찾을 수 없습니다: ' + dataType);
        }
    });

    function activateClosestTerm(currentItem) {
        if (currentItem.hasClass('desc')) {
            var closestTerm = currentItem.closest('.nav-item.term');
            if (closestTerm.length > 0) {
                closestTerm.addClass('active');
            }
        }
    }
}


function dropdown() {
    $('.dropdown').click(function () {
        $(this).next().slideToggle();
        $(this).parent().toggleClass('open');
    });
}

function quickLink() {
    document.querySelectorAll('.quick-link').forEach(quickLink => {
        quickLink.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // 스무스 스크롤
                });
            }
        })
    })
}

window.onload = function() {
    const sectionBody = document.querySelector('.section-wrap');
    const sectionHead = document.querySelector('.section-head');

    // sectionVisual은 0.5초 뒤에 활성화
    setTimeout(function() {
      sectionBody.classList.add('active');
    }, 500); // 0.5초 딜레이

    // sectionHead는 1.5초 뒤에 활성화
    setTimeout(function() {
      sectionHead.classList.add('active');
    }, 1500); // 1.5초 딜레이
};

