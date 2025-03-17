// ページの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', function() {
    // ローディングアニメーション
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingOverlay.appendChild(loadingSpinner);
    document.body.appendChild(loadingOverlay);

    // ページが完全に読み込まれたらローディングアニメーションを非表示
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingOverlay.classList.add('hidden');
            setTimeout(function() {
                loadingOverlay.remove();
                
                // ローディング完了後に初期表示要素のアニメーションを開始
                triggerInitialAnimations();
                
                // Swiperの初期化
                initSwiper();
                
                // テキストスプリットアニメーションを初期化
                initSplitTextAnimations();
                
                // パララックス効果を初期化
                initParallaxEffects();
                
                // 3Dカード効果を初期化
                init3DCardEffects();
            }, 500);
        }, 500);
    });

    // Swiperの初期化
    function initSwiper() {
        const swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            slidesPerView: 1,
            speed: 800,
            mousewheel: {
                sensitivity: 0.5, // 感度をさらに下げる（値を小さくすると感度が下がる）
                releaseOnEdges: false,
                thresholdDelta: 80, // スクロール感度をさらに調整（値を大きくすると感度が下がる）
                thresholdTime: 500, // スクロールの時間間隔をさらに調整（値を大きくすると連続スクロールが抑制される）
                forceToAxis: true, // 垂直方向のスクロールのみを検知
                eventsTarget: '.swiper-container' // イベントのターゲットを明示的に指定
            },
            keyboard: {
                enabled: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"></span>';
                },
            },
            // スナップ機能を強化
            touchReleaseOnEdges: false,
            touchRatio: 0.8, // タッチ感度を少し下げる
            threshold: 30, // しきい値を上げる
            resistanceRatio: 0, // 端までスクロールした時の抵抗を無効化
            // スライド間の遷移を確実にする
            followFinger: false, // 指の動きに追従せず、離した時点で次のスライドに移動
            longSwipesRatio: 0.2, // 短いスワイプでも次のスライドに移動（値を小さくすると少しの操作で次に進む）
            // スライド間の遷移を確実にするための追加設定
            shortSwipes: true, // 短いスワイプを有効化
            longSwipes: true, // 長いスワイプを有効化
            grabCursor: true, // グラブカーソルを表示
            preventInteractionOnTransition: true, // 遷移中の操作を防止
            // スライドの効果
            effect: 'slide', // 標準的なスライド効果
            // スライドの自動高さ
            autoHeight: false, // 自動高さを無効化
            // スライドのループ
            loop: false, // ループを無効化
            // スライドの方向
            allowSlideNext: true, // 次へのスライドを許可
            allowSlidePrev: true, // 前へのスライドを許可
            // スライドの速度
            speed: 600, // スライド速度を少し遅くする
            // スライドのイージング
            cssMode: false, // CSSモードを無効化
            on: {
                slideChange: function() {
                    // スライド変更時にアニメーションをトリガー
                    const activeSlide = document.querySelector('.swiper-slide-active');
                    if (activeSlide) {
                        triggerAnimations(activeSlide);
                    }
                    
                    // ナビゲーションのアクティブ状態を更新
                    updateNavigation(this.activeIndex);
                    
                    // スライド変更をコンソールに表示
                    console.log('Slide changed to index: ' + this.activeIndex);
                },
                init: function() {
                    // 初期スライドのアニメーションをトリガー
                    const activeSlide = document.querySelector('.swiper-slide-active');
                    if (activeSlide) {
                        triggerAnimations(activeSlide);
                    }
                    
                    // ナビゲーションのアクティブ状態を更新
                    updateNavigation(this.activeIndex);
                    
                    // 初期化完了をコンソールに表示
                    console.log('Swiper initialized with index: ' + this.activeIndex);
                },
                // スライド遷移後に確実に止まるようにする
                transitionEnd: function() {
                    // スライド遷移が完了したことをコンソールに表示
                    console.log('Slide transition completed to index: ' + this.activeIndex);
                    
                    // 現在のスライドに確実に合わせる
                    this.slideTo(this.activeIndex, 0, false);
                },
                // スライド遷移開始時
                transitionStart: function() {
                    console.log('Slide transition started from index: ' + this.previousIndex + ' to ' + this.activeIndex);
                },
                // タッチ開始時
                touchStart: function() {
                    console.log('Touch started on index: ' + this.activeIndex);
                },
                // タッチ終了時
                touchEnd: function() {
                    console.log('Touch ended on index: ' + this.activeIndex);
                    
                    // タッチ終了時に現在のスライドに確実に合わせる
                    setTimeout(() => {
                        this.slideTo(this.activeIndex, 0, false);
                    }, 100);
                }
            }
        });
        
        // ナビゲーションリンクのクリックイベント
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const slideIndex = Array.from(document.querySelectorAll('.swiper-slide')).findIndex(slide => slide.id === targetId);
                if (slideIndex !== -1) {
                    swiper.slideTo(slideIndex);
                    console.log('Navigation clicked to slide: ' + slideIndex);
                }
                
                // モバイルメニューを閉じる
                const mainNav = document.querySelector('.main-nav');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });
        
        // スワイプインジケーターのクリックイベント
        const swipeIndicators = document.querySelectorAll('.swipe-indicator');
        swipeIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                if (indicator.classList.contains('last')) {
                    swiper.slideTo(0); // 最後のインジケーターはトップに戻る
                    console.log('Last indicator clicked, returning to top');
                } else {
                    swiper.slideTo(index + 1); // 次のスライドへ
                    console.log('Indicator clicked to slide: ' + (index + 1));
                }
            });
        });

        // タッチデバイスでのスワイプ操作を改善
        document.addEventListener('touchmove', function(e) {
            // スワイプ中のスクロールを防止
            if (e.target.closest('.swiper-container')) {
                e.preventDefault();
                console.log('Touch move prevented on swiper container');
            }
        }, { passive: false });

        // スワイプ操作の後に確実に止まるようにする
        document.addEventListener('touchend', function() {
            // 現在のスライドインデックスを取得
            const currentIndex = swiper.activeIndex;
            // 少し遅延を入れて確実にスナップさせる
            setTimeout(function() {
                swiper.slideTo(currentIndex, 0, false);
                console.log('Touch end forced snap to index: ' + currentIndex);
            }, 100);
        });

        // マウスホイールイベントの制御
        let wheelTimeout;
        let isWheelLocked = false;
        
        document.addEventListener('wheel', function(e) {
            // スワイパーコンテナ内でのみ処理
            if (e.target.closest('.swiper-container')) {
                // ホイールロック中は何もしない
                if (isWheelLocked) {
                    e.preventDefault();
                    console.log('Wheel event blocked due to lock');
                    return;
                }
                
                // ホイールをロック
                isWheelLocked = true;
                console.log('Wheel locked');
                
                // 連続したホイールイベントを制限
                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(function() {
                    // 現在のスライドに確実に合わせる
                    swiper.slideTo(swiper.activeIndex, 0, false);
                    console.log('Wheel timeout forced snap to index: ' + swiper.activeIndex);
                    
                    // ロックを解除
                    setTimeout(function() {
                        isWheelLocked = false;
                        console.log('Wheel unlocked');
                    }, 800); // スライド遷移が完了するまで待機
                }, 300);
            }
        }, { passive: false });
        
        // キーボードイベントの制御
        document.addEventListener('keydown', function(e) {
            // 上下キーのみ処理
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                
                if (e.key === 'ArrowUp') {
                    swiper.slidePrev();
                    console.log('Arrow Up pressed, sliding to prev');
                } else {
                    swiper.slideNext();
                    console.log('Arrow Down pressed, sliding to next');
                }
                
                // 少し遅延を入れて確実にスナップさせる
                setTimeout(function() {
                    swiper.slideTo(swiper.activeIndex, 0, false);
                    console.log('Keyboard forced snap to index: ' + swiper.activeIndex);
                }, 100);
            }
        });
        
        // ウィンドウのリサイズ時にSwiperを更新
        window.addEventListener('resize', function() {
            swiper.update();
            console.log('Window resized, swiper updated');
        });
        
        // スワイプ操作の状態をリセットする関数
        function resetSwiperState() {
            swiper.slideTo(swiper.activeIndex, 0, false);
            console.log('Swiper state reset to index: ' + swiper.activeIndex);
        }
        
        // 定期的にスワイプ状態をリセット（念のため）
        setInterval(resetSwiperState, 5000);
        
        return swiper;
    }
    
    // ナビゲーションのアクティブ状態を更新
    function updateNavigation(activeIndex) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const slides = document.querySelectorAll('.swiper-slide');
        if (slides[activeIndex]) {
            const slideId = slides[activeIndex].id;
            const activeLink = document.querySelector(`.nav-link[href="#${slideId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // スクロールダウンアニメーション
    const hero = document.querySelector('#hero');
    if (hero) {
        const scrollDown = document.querySelector('.swipe-indicator');
        if (scrollDown) {
            scrollDown.addEventListener('click', function() {
                const nextSection = document.querySelector('#problems');
                if (nextSection) {
                    smoothScrollTo(nextSection);
                }
            });
        }
    }

    // スムーズスクロール関数
    function smoothScrollTo(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // モバイルメニュートグル
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // スクロール時のヘッダー変更
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 初期表示アニメーション
    function triggerInitialAnimations() {
        const heroElements = document.querySelectorAll('#hero .animate-on-scroll');
        heroElements.forEach(function(element, index) {
            setTimeout(function() {
                element.classList.add('animated');
            }, index * 200);
        });
    }

    // スクロールアニメーション
    function triggerAnimations(container) {
        const animatedElements = container.querySelectorAll('.animate-on-scroll:not(.animated)');
        animatedElements.forEach(function(element, index) {
            const delay = element.dataset.delay ? parseFloat(element.dataset.delay) * 1000 : index * 200;
            setTimeout(function() {
                element.classList.add('animated');
            }, delay);
        });
        
        // 時間削減グラフのアニメーション
        const progressBar = container.querySelector('.time-saved-progress');
        if (progressBar && !progressBar.classList.contains('animated')) {
            setTimeout(function() {
                const percent = progressBar.dataset.percent || 80;
                progressBar.style.width = percent + '%';
                progressBar.classList.add('animated');
            }, 500);
        }
    }

    // スクロールイベントリスナー
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.8;
        
        document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(function(element) {
            if (element.getBoundingClientRect().top + window.scrollY < scrollPosition) {
                const delay = element.dataset.delay ? element.dataset.delay : 0;
                setTimeout(function() {
                    element.classList.add('animated');
                }, delay * 1000);
            }
        });
        
        // 時間削減グラフのアニメーション
        document.querySelectorAll('.time-saved-progress:not(.animated)').forEach(function(progressBar) {
            if (progressBar.getBoundingClientRect().top + window.scrollY < scrollPosition) {
                const percent = progressBar.dataset.percent || 80;
                progressBar.style.width = percent + '%';
                progressBar.classList.add('animated');
            }
        });
    });

    // テキストスプリットアニメーション
    function initSplitTextAnimations() {
        const textElements = document.querySelectorAll('.text-reveal');
        textElements.forEach(function(element) {
            const text = element.textContent;
            element.textContent = '';
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.transitionDelay = (i * 0.03) + 's';
                element.appendChild(span);
            }
            
            // アニメーションをトリガー
            setTimeout(function() {
                element.classList.add('animated');
            }, 100);
        });
    }

    // パララックス効果
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxElements.forEach(function(element) {
                const speed = element.dataset.speed || 0.1;
                const x = (0.5 - mouseX) * speed * 100;
                const y = (0.5 - mouseY) * speed * 100;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // 3Dカード効果
    function init3DCardEffects() {
        const cards = document.querySelectorAll('.card-3d');
        
        cards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                const rotateY = (mouseX / cardRect.width) * 20;
                const rotateX = -((mouseY / cardRect.height) * 20);
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // 画像の遅延読み込み
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        lazyImages.forEach(function(img) {
            img.src = img.dataset.src;
        });
    }

    // FAQアコーディオン
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // 他のアイテムを閉じる
            faqItems.forEach(function(otherItem) {
                otherItem.classList.remove('active');
            });
            
            // クリックされたアイテムを開く（すでに開いていた場合は閉じる）
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // お問い合わせフォーム送信
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const formDataObj = {};
            
            formData.forEach(function(value, key) {
                formDataObj[key] = value;
            });
            
            // 送信ボタンを無効化
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';
            
            // 実際のフォーム送信処理はここに実装
            // 例: fetch APIを使用したPOSTリクエスト
            
            // 送信成功のシミュレーション
            setTimeout(function() {
                // 送信完了メッセージ
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
                
                // フォームを非表示にして成功メッセージを表示
                contactForm.style.display = 'none';
                contactForm.parentNode.appendChild(successMessage);
            }, 1500);
        });
    }
});

// 画像プリロード関数
function preloadImages(sources, callback) {
    let counter = 0;
    
    function onLoad() {
        counter++;
        if (counter >= sources.length && callback) {
            callback();
        }
    }
    
    for (let i = 0; i < sources.length; i++) {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = onLoad;
        img.src = sources[i];
    }
}

// 重要な画像をプリロード
const imagesToPreload = [
    'images/hero-image.png',
    'images/before-image.png',
    'images/after-image.png',
    'images/line-checkin.png',
    'images/line-checkout.png',
    'images/line-record.png',
    'images/manager-dashboard.png',
    'images/spreadsheet.png',
    'images/case-study.png',
    'images/qr-code.png',
    'images/pattern.png'
];

preloadImages(imagesToPreload); 