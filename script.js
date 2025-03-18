// DOM要素の取得を最適化
const DOM = {
    body: document.body,
    swiperContainer: document.querySelector('.swiper-container'),
    swiperWrapper: document.querySelector('.swiper-wrapper'),
    swiperSlides: document.querySelectorAll('.swiper-slide'),
    swipeIndicators: document.querySelectorAll('.swipe-indicator'),
    header: document.querySelector('.header'),
    menuToggle: document.querySelector('.menu-toggle'),
    mainNav: document.querySelector('.main-nav'),
    navLinks: document.querySelectorAll('.main-nav a'),
    animateElements: document.querySelectorAll('.animate-on-scroll'),
    scrollAnimateElements: document.querySelectorAll('.scroll-animate'),
    progressBar: document.createElement('div'),
    // GSAP用の要素を追加
    lineMessagingSection: document.querySelector('.line-messaging-section'),
    comparisonSection: document.querySelector('.comparison-section')
};

// グローバル変数
let swiper;
let isScrolling = false;
let lastScrollTime = 0;
let touchStartY = 0;
let deviceType = detectDeviceType();
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollObserver;
let lastScrollY = 0;
let ticking = false;
let scrollAnimations = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded イベント発火 - ページ読み込み完了');
    
    // デバッグ用にHTML構造をログ出力
    logHtmlStructure();
    
    // パフォーマンス最適化のためにrequestAnimationFrameを使用
    requestAnimationFrame(() => {
        initApp();
    });
});

// HTMLの構造をログに出力（デバッグ用）
function logHtmlStructure() {
    console.log('=== HTML構造の検証 ===');
    console.log('スワイパーコンテナ:', DOM.swiperContainer);
    console.log('スワイパーラッパー:', DOM.swiperWrapper);
    console.log('スワイパースライド数:', DOM.swiperSlides.length);
    
    // 各スライドのIDとクラスをログ出力
    DOM.swiperSlides.forEach((slide, index) => {
        console.log(`スライド[${index}]:`, slide.id, 'クラス:', slide.className);
    });
}

// アプリケーションの初期化
function initApp() {
    console.log('アプリケーション初期化開始');
    
    // 表示を確実にするための初期スタイル適用
    ensureVisibility();
    
    // スクロールアニメーションの初期化（最初に実行）
    initScrollAnimations();
    
    // Swiperの初期化
    initSwiper();
    
    // イベントリスナーの設定
    setupEventListeners();
                
    // アクセシビリティの向上
    enhanceAccessibility();
                
    // ブラウザサポートのチェック
    checkBrowserSupport();
    
    // GSAP アニメーションの初期化
    if (!isReducedMotion) {
        initGSAPAnimations();
    }
    
    // 画像の遅延読み込み
    lazyLoadImages();
    
    // スクロール進行状況バーの初期化
    initScrollProgressBar();
    
    // パフォーマンス追跡の初期化
    if (window.performance && window.performance.mark) {
        window.performance.mark('app-initialized');
    }

    console.log('アプリケーション初期化完了');
}

// 表示を確実にする関数
function ensureVisibility() {
    // 全セクションの表示を強制
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.style.display = 'block';
        console.log(`セクション表示強制: ${section.id}`);
    });
    
    // すべてのカード要素の表示を強制
    const allCards = document.querySelectorAll('.problem-card, .feature-card, .pricing-card');
    allCards.forEach(card => {
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.display = 'flex';
        console.log('カード表示強制');
    });
    
    // コンタクトフォームの表示を強制
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.style.visibility = 'visible';
        contactForm.style.opacity = '1';
        contactForm.style.display = 'block';
        console.log('コンタクトフォーム表示強制');
    }
}

// デバイスタイプの検出
function detectDeviceType() {
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// スワイプ進行状況バーの初期化
function initProgressBar() {
    DOM.progressBar.className = 'swipe-progress';
    document.body.appendChild(DOM.progressBar);
}

// スワイプ進行状況の更新
function updateProgressBar(progress) {
    DOM.progressBar.style.width = `${progress * 100}%`;
}

// Swiperの初期化
function initSwiper() {
    // Swiperのオプション設定
    const swiperOptions = {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        threshold: 20,
        resistanceRatio: 0,
        followFinger: true,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        
        // マウスホイール設定
        mousewheel: {
            enabled: true,
            sensitivity: deviceType === 'mobile' ? 0.8 : 1,
            thresholdDelta: deviceType === 'mobile' ? 70 : 50,
            thresholdTime: deviceType === 'mobile' ? 400 : 300,
            releaseOnEdges: false
        },
        
        // キーボードナビゲーション
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        
        // ページネーション
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}" role="button" aria-label="ページ ${index + 1}へ移動" tabindex="0"></span>`;
            }
        },
        
        // アクセシビリティ
        a11y: {
            enabled: true,
            notificationClass: 'swiper-notification',
            prevSlideMessage: '前のスライドへ',
            nextSlideMessage: '次のスライドへ',
            firstSlideMessage: '最初のスライドです',
            lastSlideMessage: '最後のスライドです',
            paginationBulletMessage: '{{index}}番目のスライドへ'
        },
        
        // コールバック関数
        on: {
            init: function() {
                console.log('Swiper初期化イベント発火');
                updateSwipeIndicators(this.activeIndex, this.slides.length);
                updateProgressBar(this.activeIndex / (this.slides.length - 1));
                
                // スライド内のアニメーションを観察
                observeSlideAnimations(this.slides[this.activeIndex]);
                
                // スワイプ可能な方向を示すARIA属性を設定
                updateAriaAttributes(this.activeIndex, this.slides.length);
                
                // 現在のスライドを強制的に表示
                forceActiveSlideVisibility(this.activeIndex);
            },
            slideChange: function() {
                console.log('スライド変更イベント発火:', this.activeIndex);
                updateSwipeIndicators(this.activeIndex, this.slides.length);
                updateProgressBar(this.activeIndex / (this.slides.length - 1));
                
                // ARIA属性の更新
                this.slides.forEach((slide, index) => {
                    if (index === this.activeIndex) {
                        slide.setAttribute('aria-current', 'true');
                    } else {
                        slide.removeAttribute('aria-current');
                    }
                });
                
                // スワイプ可能な方向を示すARIA属性を更新
                updateAriaAttributes(this.activeIndex, this.slides.length);
                
                // スライド内のアニメーションを観察
                observeSlideAnimations(this.slides[this.activeIndex]);
                
                // 現在のスライドを強制的に表示
                forceActiveSlideVisibility(this.activeIndex);
                
                // アナリティクスイベントの送信（実装されている場合）
                if (typeof trackPageView === 'function') {
                    trackPageView(`Slide ${this.activeIndex + 1}`);
                }
            },
            touchStart: function() {
                DOM.swiperContainer.classList.add('grabbing');
                DOM.swiperContainer.classList.add('swiping');
            },
            touchEnd: function() {
                DOM.swiperContainer.classList.remove('grabbing');
                setTimeout(() => {
                    DOM.swiperContainer.classList.remove('swiping');
                }, 300);
            },
            transitionStart: function() {
                isScrolling = true;
                console.log('スライド遷移開始');
            },
            transitionEnd: function() {
                isScrolling = false;
                console.log('スライド遷移完了');
                
                // 遷移後に再度アクティブスライドの表示を確認
                setTimeout(() => {
                    forceActiveSlideVisibility(this.activeIndex);
                }, 100);
            }
        }
    };
    
    // 動きの低減設定が有効な場合、アニメーション速度を調整
    if (isReducedMotion) {
        swiperOptions.speed = 400;
        swiperOptions.effect = 'fade';
        swiperOptions.fadeEffect = {
            crossFade: true
        };
    }
    
    // Swiperインスタンスの作成
    swiper = new Swiper('.swiper-container', swiperOptions);
    
    console.log('Swiper初期化完了');
}

// 現在のスライドを強制的に表示する関数
function forceActiveSlideVisibility(activeIndex) {
    console.log('アクティブスライドの表示を強制:', activeIndex);
    
    // すべてのスライドを一度非表示に
    DOM.swiperSlides.forEach((slide, index) => {
        if (index !== activeIndex) {
            slide.style.visibility = 'hidden';
            slide.style.opacity = '0';
            slide.classList.remove('swiper-slide-visible');
        }
    });
    
    // アクティブスライドを表示
    const activeSlide = DOM.swiperSlides[activeIndex];
    
    if (activeSlide) {
        activeSlide.style.visibility = 'visible';
        activeSlide.style.opacity = '1';
        activeSlide.style.display = 'flex';
        activeSlide.classList.add('swiper-slide-visible');
        
        // スライド内のすべての要素を確実に表示
        const allElements = activeSlide.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                
                // 特定の要素は表示方法を維持
                if (el.classList.contains('container') || el.tagName === 'DIV') {
                    el.style.display = el.style.display || 'block';
                }
                
                // セクションの見出しと説明を確実に表示
                if (el.classList.contains('section-title') || 
                    el.tagName === 'H2' || 
                    el.tagName === 'H3' || 
                    el.tagName === 'P') {
                    el.style.display = 'block';
                }
                
                // グリッドレイアウトを維持
                if (el.classList.contains('problems-grid') || 
                    el.classList.contains('features-grid') || 
                    el.classList.contains('pricing-cards')) {
                    el.style.display = 'grid';
                }
                
                // カード要素はフレックス表示を維持
                if (el.classList.contains('problem-card') || 
                    el.classList.contains('feature-card') || 
                    el.classList.contains('pricing-card')) {
                    el.style.display = 'flex';
                }
            }
        });
        
        console.log(`アクティブスライド[${activeIndex}]を表示強制: ${activeSlide.id}`);
    } else {
        console.error('アクティブスライドが見つかりません:', activeIndex);
    }
}

// スライド内のアニメーション要素を観察する関数を強化
function observeSlideAnimations(slide) {
    console.log('スライド内のアニメーション要素を観察:', slide.id);
    
    // アニメーション要素を取得
    const animateElements = slide.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    if (animateElements.length === 0) {
        console.log('アニメーション要素が見つかりません');
        return;
    }
    
    console.log(`${animateElements.length}個のアニメーション要素を検出`);
    
    // 位置に基づいて要素をグループ化（垂直位置順にソート）
    const sortedElements = Array.from(animateElements).sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return aRect.top - bRect.top;
    });
    
    // グループ分けして表示（垂直位置が近い要素は同じグループに）
    const groups = [];
    let currentGroup = [];
    let lastPosition = -1;
    
    sortedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // 新しいグループを開始する条件
        if (lastPosition === -1 || rect.top - lastPosition > 50) {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [element];
        } else {
            currentGroup.push(element);
        }
        
        lastPosition = rect.top;
    });
    
    // 最後のグループを追加
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    
    console.log(`${groups.length}個のアニメーショングループを作成`);
    
    // グループごとに遅延を設定して表示
    groups.forEach((group, groupIndex) => {
        // グループの基本遅延（上のグループから順に表示）
        const groupDelay = groupIndex * 0.15;
        
        console.log(`グループ${groupIndex + 1}: ${group.length}個の要素、基本遅延: ${groupDelay}s`);
        
        // グループ内の各要素にさらに小さな追加遅延を適用
        group.forEach((element, elementIndex) => {
            // 要素の遅延 = グループ遅延 + 要素ごとの追加遅延
            const baseDelay = element.dataset.delay ? parseFloat(element.dataset.delay) : 0;
            const additionalDelay = elementIndex * 0.05; // 各要素に50msの追加遅延
            const totalDelay = baseDelay + groupDelay + additionalDelay;
            
            // 要素に明示的に遅延を設定
            element.style.transitionDelay = `${totalDelay}s`;
            
            console.log(`  - 要素${elementIndex + 1}: 合計遅延=${totalDelay}s (base=${baseDelay}, group=${groupDelay}, add=${additionalDelay})`);
            
            // アニメーションクラスを追加
            setTimeout(() => {
                element.classList.add('animated');
                console.log(`アニメーションを適用: ${element.tagName}.${element.className}, 遅延: ${totalDelay}s`);
            }, totalDelay * 1000);
        });
    });
}

// スクロールアニメーションの初期化関数を強化
function initScrollAnimations() {
    console.log('スクロールアニメーション初期化開始');
    
    // すべてのanimate-on-scroll要素を取得
    const allAnimateElements = document.querySelectorAll('.animate-on-scroll, .scroll-animate');
    
    if (allAnimateElements.length === 0) {
        console.log('アニメーション要素が見つかりません');
        return;
    }
    
    console.log(`${allAnimateElements.length}個のアニメーション要素を検出`);
    
    // IntersectionObserverの設定
    const options = {
        root: null, // ビューポート全体を監視
        rootMargin: '30px', // 余裕を持たせる
        threshold: [0, 0.1, 0.2, 0.3] // 一定間隔で検出
    };
    
    // IntersectionObserverの作成
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 動きの低減設定が有効な場合はすべての要素に即座にアニメーションを適用
            if (isReducedMotion) {
                entry.target.classList.add('animated');
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
                return;
            }
            
            const element = entry.target;
            
            if (entry.isIntersecting) {
                const ratio = entry.intersectionRatio;
                console.log(`要素が画面に入りました: ${entry.target.tagName}.${entry.target.className}, 可視率: ${ratio.toFixed(2)}`);
                
                // 要素の位置を考慮して重なりを防止
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const verticalPosition = rect.top / viewportHeight;
                
                // 上部から下部にかけて徐々に遅延を増やす (0.0s～0.3s)
                const positionDelay = Math.min(0.3, verticalPosition * 0.3);
                
                // 基本遅延とレイアウト位置に基づく遅延を組み合わせる
                const baseDelay = element.dataset.delay ? parseFloat(element.dataset.delay) : 0;
                const totalDelay = baseDelay + positionDelay;
                
                console.log(`  - 位置: ${(verticalPosition * 100).toFixed(0)}%, 位置による遅延: ${positionDelay.toFixed(2)}s, 合計遅延: ${totalDelay.toFixed(2)}s`);
                
                if (ratio >= 0.1) { // 10%以上見えている場合
                    // 遅延を明示的に設定
                    element.style.transitionDelay = `${totalDelay}s`;
                    
                    setTimeout(() => {
                        element.classList.add('animated');
                        element.classList.add('active');
                        console.log(`アニメーションを適用: ${element.tagName}.${element.className}, 遅延: ${totalDelay}s`);
                    }, totalDelay * 1000);
                    
                    // 一度アニメーションが発火したら監視を解除
                    observer.unobserve(element);
                }
            }
        });
    }, options);
    
    // 各要素を監視する前に、画面上で重なる可能性のある要素をグループ化
    // 同じ領域にある要素は少し遅延を変えて表示する
    const elementGroups = groupElementsByPosition(allAnimateElements);
    
    // グループごとに監視を開始
    elementGroups.forEach((group, groupIndex) => {
        console.log(`グループ${groupIndex + 1}の監視を開始: ${group.length}個の要素`);
        
        group.forEach((element, elementIndex) => {
            // グループとグループ内のインデックスに基づいて監視を開始
            observer.observe(element);
            console.log(`  - 監視開始: ${element.tagName}.${element.className}`);
        });
    });
    
    console.log('スクロールアニメーション初期化完了');
}

// 位置に基づいて要素をグループ化する関数を最適化
function groupElementsByPosition(elements) {
    // 画面を縦に4つのエリアに分割
    const groups = [[], [], [], []];
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // 要素の中心位置に基づいてグループを決定
        const centerY = rect.top + rect.height / 2;
        const relativePosition = centerY / viewportHeight;
        
        // デバッグ出力
        console.log(`要素 ${element.tagName}.${element.className}: 相対位置=${(relativePosition * 100).toFixed(0)}%`);
        
        if (relativePosition < 0.25) {
            groups[0].push(element);
            console.log('  -> グループ1に配置（上部）');
        } else if (relativePosition < 0.5) {
            groups[1].push(element);
            console.log('  -> グループ2に配置（上中部）');
        } else if (relativePosition < 0.75) {
            groups[2].push(element);
            console.log('  -> グループ3に配置（下中部）');
        } else {
            groups[3].push(element);
            console.log('  -> グループ4に配置（下部）');
        }
    });
    
    // 各グループの要素数を出力
    groups.forEach((group, index) => {
        console.log(`グループ${index + 1}: ${group.length}個の要素`);
    });
    
    return groups;
}

// スワイプインジケーターの更新
function updateSwipeIndicators(activeIndex, totalSlides) {
    DOM.swipeIndicators.forEach((indicator, index) => {
        // 最後のスライドでは上向きインジケーターを表示
        if (activeIndex === totalSlides - 1 && index === totalSlides - 1) {
            indicator.style.display = 'flex';
        } 
        // 現在のスライドの下向きインジケーターを表示
        else if (index === activeIndex) {
            indicator.style.display = 'flex';
        } 
        // それ以外のインジケーターは非表示
        else {
            indicator.style.display = 'none';
        }
    });
}

// ARIA属性の更新
function updateAriaAttributes(activeIndex, totalSlides) {
    const container = DOM.swiperContainer;
    
    // スワイプ可能な方向を示す
    if (activeIndex === 0) {
        container.setAttribute('aria-description', '下にスワイプして次のコンテンツを表示できます');
    } else if (activeIndex === totalSlides - 1) {
        container.setAttribute('aria-description', '上にスワイプして前のコンテンツに戻れます');
    } else {
        container.setAttribute('aria-description', '上下にスワイプしてコンテンツを切り替えられます');
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // ヘッダーのスクロール処理
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // メニュートグルの処理
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', toggleMenu);
    }
    
    // ナビゲーションリンクのクリック処理
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // スワイプインジケーターのクリック処理
    DOM.swipeIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            // 最後のスライドの場合は最初のスライドに戻る
            if (index === DOM.swiperSlides.length - 1) {
                swiper.slideTo(0);
            } else {
                // それ以外は次のスライドに進む
                swiper.slideTo(index + 1);
            }
        });
        
        // キーボードアクセシビリティ
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (index === DOM.swiperSlides.length - 1) {
                    swiper.slideTo(0);
                } else {
                    swiper.slideTo(index + 1);
                }
            }
        });
    });
    
    // タッチイベントの処理
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // ホイールイベントの処理
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    // キーボードイベントの処理
    document.addEventListener('keydown', handleKeyDown);
    
    // ウィンドウのリサイズ処理
    window.addEventListener('resize', debounce(handleResize, 200));
    
    // 動きの低減設定の変更を監視
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReducedMotionChange);
    
    // ページの可視性変更時の処理
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // スクロールイベントリスナーの追加
    window.addEventListener('scroll', throttle(handleScrollAnimation, 10));
    
    // リサイズイベントリスナーの追加
    window.addEventListener('resize', debounce(() => {
        // スクロールアニメーション要素の位置情報を更新
        updateScrollAnimationRects();
        
        // その他のリサイズ処理
        handleResize();
    }, 200));
    
    // スライドの表示を強制するイベントリスナーを追加
    window.addEventListener('resize', debounce(() => {
        if (swiper) {
            forceActiveSlideVisibility(swiper.activeIndex);
        }
    }, 200));
    
    console.log('イベントリスナー設定完了');
}

// スクロール処理
function handleScroll() {
    if (window.scrollY > 50) {
        DOM.header.classList.add('scrolled');
    } else {
        DOM.header.classList.remove('scrolled');
    }
}

// メニュートグル処理
function toggleMenu() {
    DOM.mainNav.classList.toggle('active');
    const isExpanded = DOM.mainNav.classList.contains('active');
    DOM.menuToggle.setAttribute('aria-expanded', isExpanded);
    
    // メニューが開いている場合はスワイプを無効化
    if (isExpanded) {
        swiper.allowTouchMove = false;
    } else {
        swiper.allowTouchMove = true;
    }
}

// ナビゲーションリンクのクリック処理
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetIndex = Array.from(DOM.swiperSlides).findIndex(slide => 
        slide.id === targetId || slide.querySelector(`#${targetId}`)
    );
    
    if (targetIndex !== -1) {
        swiper.slideTo(targetIndex);
    }
    
    // モバイルメニューが開いている場合は閉じる
    if (DOM.mainNav.classList.contains('active')) {
        toggleMenu();
    }
}

// タッチスタート処理
function handleTouchStart(e) {
    // スワイパー内のタッチイベントのみを処理
    if (!isElementInSwiper(e.target)) return;
    
    touchStartY = e.touches[0].clientY;
}

// タッチムーブ処理
function handleTouchMove(e) {
    // スワイパー内のタッチイベントのみを処理
    if (!isElementInSwiper(e.target)) return;
    
    // スクロール中は追加のタッチイベントを防止
    if (isScrolling) {
        e.preventDefault();
    }
}

// ホイール処理
function handleWheel(e) {
    // スワイパー内のホイールイベントのみを処理
    if (!isElementInSwiper(e.target)) return;
    
    // スクロール中は追加のホイールイベントを防止
    if (isScrolling) {
        e.preventDefault();
    }
    
    // スロットリングによるホイールイベントの制限
    const now = Date.now();
    if (now - lastScrollTime < 50) {
        e.preventDefault();
        return;
    }
    lastScrollTime = now;
}

// キーボード処理
function handleKeyDown(e) {
    // 矢印キーでのナビゲーション
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        if (e.key === 'ArrowUp') {
            swiper.slidePrev();
        } else {
            swiper.slideNext();
        }
    }
}

// リサイズ処理
function handleResize() {
    // デバイスタイプの再検出
    deviceType = detectDeviceType();
    
    // Swiperの更新
    swiper.update();
    
    // マウスホイール感度の調整
    swiper.params.mousewheel.sensitivity = deviceType === 'mobile' ? 0.8 : 1;
    swiper.params.mousewheel.thresholdDelta = deviceType === 'mobile' ? 70 : 50;
}

// 動きの低減設定変更処理
function handleReducedMotionChange(e) {
    isReducedMotion = e.matches;
    
    // Swiperの設定を更新
    if (isReducedMotion) {
        swiper.params.speed = 400;
        swiper.params.effect = 'fade';
    } else {
        swiper.params.speed = 800;
        swiper.params.effect = 'slide';
    }
    
    swiper.update();
}

// ページの可視性変更処理
function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // ページが再表示された時の処理
        swiper.update();
    }
}

// 要素がスワイパー内にあるかチェック
function isElementInSwiper(element) {
    let current = element;
    while (current) {
        if (current === DOM.swiperContainer) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}

// スライドのアニメーション要素をリセットする関数（非アクティブスライド用）
function resetSlideAnimations(slide) {
    console.log('スライドのアニメーションをリセット:', slide.id);
    
    const animateElements = slide.querySelectorAll('.animate-on-scroll, .scroll-animate');
    
    animateElements.forEach(element => {
        element.classList.remove('animated');
        element.classList.remove('active');
        element.style.transition = 'none';
        element.style.transitionDelay = '0s';
        
        // フェードアニメーションの初期状態に
        element.style.opacity = '0';
        
        // データアニメーションに基づいて適切な変形を設定
        const animation = element.dataset.animation;
        if (animation) {
            switch (animation) {
                case 'animate__fadeInDown':
                    element.style.transform = 'translateY(-20px)';
                    break;
                case 'animate__fadeInUp':
                    element.style.transform = 'translateY(20px)';
                    break;
                case 'animate__fadeInLeft':
                    element.style.transform = 'translateX(-20px)';
                    break;
                case 'animate__fadeInRight':
                    element.style.transform = 'translateX(20px)';
                    break;
                case 'animate__zoomIn':
                    element.style.transform = 'scale(0.9)';
                    break;
                default:
                    element.style.transform = 'translateY(20px)';
            }
        }
        
        // トランジションを再設定
        setTimeout(() => {
            element.style.transition = '';
        }, 50);
    });
}

// スクロールアニメーションの処理
function handleScrollAnimation() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        requestAnimationFrame(() => {
            // スクロールプログレスバーの更新
            updateScrollProgressBar();
            
            // パララックス効果の更新
            updateParallaxElements();
            
            // スティッキーセクションの更新
            updateStickyElements();
            
            // スクロールシーケンスの更新
            updateScrollSequence();
            
            // 3D回転効果の更新
            updateRotateElements();
            
            // スケール効果の更新
            updateScaleElements();
            
            // 不透明度効果の更新
            updateFadeElements();
            
            // ぼかし効果の更新
            updateBlurElements();
            
            // 位置変化効果の更新
            updateMoveElements();
            
            // カウントアップアニメーションの更新
            updateCountUpElements();
            
            ticking = false;
        });
        
        ticking = true;
    }
}

// 閾値リストの作成（滑らかなアニメーションのため）
function buildThresholdList() {
    const thresholds = [];
    const numSteps = 20;
    
    for (let i = 0; i <= numSteps; i++) {
        thresholds.push(i / numSteps);
    }
    
    return thresholds;
}

// 要素のアニメーションを更新
function updateElementAnimation(element, ratio) {
    // アニメーション効果の種類に基づいて処理
    const effect = element.dataset.effect || 'fade-up';
    const intensity = element.dataset.intensity || 'default';
    
    // 進行度に応じたスタイルの適用
    switch (effect) {
        case 'fade-up':
            applyTransformStyle(element, `translate3d(0, ${calculateDistance(ratio, intensity)}px, 0)`);
            break;
        case 'fade-down':
            applyTransformStyle(element, `translate3d(0, ${-calculateDistance(ratio, intensity)}px, 0)`);
            break;
        case 'fade-left':
            applyTransformStyle(element, `translate3d(${calculateDistance(ratio, intensity)}px, 0, 0)`);
            break;
        case 'fade-right':
            applyTransformStyle(element, `translate3d(${-calculateDistance(ratio, intensity)}px, 0, 0)`);
            break;
        case 'zoom-in':
            const scaleIn = 0.9 + (ratio * 0.1);
            applyTransformStyle(element, `scale3d(${scaleIn}, ${scaleIn}, ${scaleIn})`);
            break;
        case 'zoom-out':
            const scaleOut = 1.1 - (ratio * 0.1);
            applyTransformStyle(element, `scale3d(${scaleOut}, ${scaleOut}, ${scaleOut})`);
            break;
        case 'blur':
            const blurValue = 10 - (ratio * 10);
            element.style.filter = `blur(${blurValue}px)`;
            break;
        case 'rotate':
            const rotateValue = 5 - (ratio * 5);
            applyTransformStyle(element, `rotate3d(0, 0, 1, ${rotateValue}deg)`);
            break;
    }
    
    // 不透明度の適用
    element.style.opacity = ratio;
}

// 距離の計算（強度に応じて）
function calculateDistance(ratio, intensity) {
    let baseDistance = 50;
    
    switch (intensity) {
        case 'subtle':
            baseDistance = 20;
            break;
        case 'strong':
            baseDistance = 80;
            break;
    }
    
    return baseDistance - (ratio * baseDistance);
}

// 変形スタイルの適用
function applyTransformStyle(element, transform) {
    element.style.transform = transform;
}

// パララックス要素の更新
function updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax-scroll');
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.speed || 0.3);
        const direction = element.dataset.direction || 'up';
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenter = rect.top + (rect.height / 2);
            const windowCenter = windowHeight / 2;
            const distanceFromCenter = elementCenter - windowCenter;
            
            // パララックス効果の計算
            const parallaxOffset = distanceFromCenter * speed;
            
            // 方向に応じた変形の適用
            if (direction === 'up') {
                element.style.transform = `translateY(${-parallaxOffset}px)`;
            } else {
                element.style.transform = `translateY(${parallaxOffset}px)`;
            }
        }
    });
}

// スティッキー要素の更新
function updateStickyElements() {
    const stickySections = document.querySelectorAll('.sticky-section');
    
    stickySections.forEach(section => {
        const container = section.querySelector('.sticky-container');
        const content = section.querySelector('.sticky-content');
        
        if (container && content) {
            const rect = section.getBoundingClientRect();
            const progress = calculateStickyProgress(rect);
            
            // プログレスに応じたアニメーションの適用
            if (progress >= 0 && progress <= 1) {
                // コンテンツ内の要素にプログレスを適用
                const animatedElements = content.querySelectorAll('[data-sticky-animate]');
                
                animatedElements.forEach(element => {
                    const effect = element.dataset.stickyAnimate;
                    
                    switch (effect) {
                        case 'fade':
                            element.style.opacity = progress;
                            break;
                        case 'slide-up':
                            const slideDistance = 100 - (progress * 100);
                            element.style.transform = `translateY(${slideDistance}px)`;
                            break;
                        case 'scale':
                            const scale = 0.8 + (progress * 0.2);
                            element.style.transform = `scale(${scale})`;
                            break;
                    }
                });
            }
        }
    });
}

// スティッキーセクションのプログレス計算
function calculateStickyProgress(rect) {
    const windowHeight = window.innerHeight;
    const sectionHeight = rect.height;
    
    // セクションの上端が画面上部に達した時のオフセット
    const offsetTop = rect.top;
    
    // プログレスの計算（0〜1の範囲）
    let progress = 1 - (offsetTop / (sectionHeight - windowHeight));
    
    // 範囲を0〜1に制限
    return Math.max(0, Math.min(1, progress));
}

// スクロールシーケンスの更新
function updateScrollSequence() {
    const sequences = document.querySelectorAll('.scroll-sequence');
    
    sequences.forEach(sequence => {
        const items = sequence.querySelectorAll('.scroll-sequence-item');
        const rect = sequence.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // シーケンスが画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // プログレスの計算（0〜1の範囲）
            const progress = 1 - (rect.top / (windowHeight - rect.height));
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            // アイテム数に基づいてインデックスを計算
            const itemCount = items.length;
            const activeIndex = Math.floor(clampedProgress * itemCount);
            
            // 各アイテムのアクティブ状態を更新
            items.forEach((item, index) => {
                if (index === activeIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}

// 3D回転要素の更新
function updateRotateElements() {
    const rotateElements = document.querySelectorAll('.rotate-on-scroll-item');
    
    rotateElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenterX = rect.left + (rect.width / 2);
            const elementCenterY = rect.top + (rect.height / 2);
            
            // 画面中心からの距離を計算
            const distanceX = (elementCenterX - (windowWidth / 2)) / (windowWidth / 2);
            const distanceY = (elementCenterY - (windowHeight / 2)) / (windowHeight / 2);
            
            // 回転角度の計算
            const rotateX = -distanceY * 10; // Y軸の距離に基づいてX軸回転
            const rotateY = distanceX * 10; // X軸の距離に基づいてY軸回転
            
            // CSSカスタムプロパティの設定
            element.style.setProperty('--rotate-x', `${rotateX}deg`);
            element.style.setProperty('--rotate-y', `${rotateY}deg`);
        }
    });
}

// スケール要素の更新
function updateScaleElements() {
    const scaleElements = document.querySelectorAll('.scale-on-scroll');
    
    scaleElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenter = rect.top + (rect.height / 2);
            const windowCenter = windowHeight / 2;
            
            // 画面中心からの距離を計算（-1〜1の範囲）
            const distanceFromCenter = (elementCenter - windowCenter) / (windowHeight / 2);
            
            // スケール係数の計算（0.8〜1.2の範囲）
            const scaleFactor = 1 - (Math.abs(distanceFromCenter) * 0.2);
            
            // CSSカスタムプロパティの設定
            element.style.setProperty('--scale-factor', scaleFactor);
        }
    });
}

// 不透明度要素の更新
function updateFadeElements() {
    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    
    fadeElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenter = rect.top + (rect.height / 2);
            const windowCenter = windowHeight / 2;
            
            // 画面中心からの距離を計算（0〜1の範囲）
            const distanceFromCenter = Math.abs((elementCenter - windowCenter) / (windowHeight / 2));
            
            // 不透明度の計算（0.3〜1の範囲）
            const opacityFactor = 1 - (distanceFromCenter * 0.7);
            
            // CSSカスタムプロパティの設定
            element.style.setProperty('--opacity-factor', opacityFactor);
        }
    });
}

// ぼかし要素の更新
function updateBlurElements() {
    const blurElements = document.querySelectorAll('.blur-on-scroll');
    
    blurElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenter = rect.top + (rect.height / 2);
            const windowCenter = windowHeight / 2;
            
            // 画面中心からの距離を計算（0〜1の範囲）
            const distanceFromCenter = Math.abs((elementCenter - windowCenter) / (windowHeight / 2));
            
            // ぼかし値の計算（0〜5pxの範囲）
            const blurFactor = distanceFromCenter * 5;
            
            // CSSカスタムプロパティの設定
            element.style.setProperty('--blur-factor', `${blurFactor}px`);
        }
    });
}

// 位置変化要素の更新
function updateMoveElements() {
    const moveElements = document.querySelectorAll('.move-on-scroll');
    
    moveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内にある場合のみ処理
        if (rect.top < windowHeight && rect.bottom > 0) {
            // 要素の中心位置を計算
            const elementCenter = rect.top + (rect.height / 2);
            const windowCenter = windowHeight / 2;
            
            // 画面中心からの距離を計算（-1〜1の範囲）
            const distanceFromCenter = (elementCenter - windowCenter) / (windowHeight / 2);
            
            // 移動距離の計算
            const moveX = element.dataset.moveX ? distanceFromCenter * parseFloat(element.dataset.moveX) : 0;
            const moveY = element.dataset.moveY ? distanceFromCenter * parseFloat(element.dataset.moveY) : 0;
            const moveZ = element.dataset.moveZ ? distanceFromCenter * parseFloat(element.dataset.moveZ) : 0;
            
            // CSSカスタムプロパティの設定
            element.style.setProperty('--translate-x', `${moveX}px`);
            element.style.setProperty('--translate-y', `${moveY}px`);
            element.style.setProperty('--translate-z', `${moveZ}px`);
        }
    });
}

// カウントアップ要素の更新
function updateCountUpElements() {
    const countUpElements = document.querySelectorAll('.count-up');
    
    countUpElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 要素が画面内に入った場合のみ処理
        if (rect.top < windowHeight * 0.8 && !element.classList.contains('active')) {
            element.classList.add('active');
        }
    });
}

// スクロールアニメーション要素の位置情報を更新
function updateScrollAnimationRects() {
    scrollAnimations.forEach(animation => {
        animation.rect = animation.element.getBoundingClientRect();
    });
}

// ユーティリティ関数: スロットリング
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// ユーティリティ関数: デバウンス
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ユーティリティ関数: アナリティクスイベントの送信（実装例）
function trackPageView(pageName) {
    // アナリティクスが実装されている場合に使用
    if (window.gtag) {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href,
            page_path: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`
        });
    }
}

// ブラウザのサポート状況をチェック
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        passiveEvents: (function() {
            let supportsPassive = false;
            try {
                window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                    get: function() { supportsPassive = true; }
                }));
            } catch(e) {}
            return supportsPassive;
        })(),
        touchEvents: 'ontouchstart' in window,
        customProperties: CSS.supports('(--test: 0)'),
        webp: (function() {
            const elem = document.createElement('canvas');
            if (elem.getContext && elem.getContext('2d')) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        })()
    };
    
    // サポート状況に基づいてクラスを追加
    for (const feature in features) {
        if (features[feature]) {
            document.documentElement.classList.add(`has-${feature}`);
        } else {
            document.documentElement.classList.add(`no-${feature}`);
        }
    }
    
    return features;
}

// ブラウザのサポート状況をチェック
const browserSupport = checkBrowserSupport();

// スクロールプログレスバーの初期化
function initScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
}

// スクロールプログレスバーの更新
function updateScrollProgressBar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollTop / scrollHeight;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }
}

// GSAP アニメーションの初期化関数を修正
function initGSAPAnimations() {
    // GSAP と ScrollTrigger を登録
    gsap.registerPlugin(ScrollTrigger);
    
    console.log('GSAP アニメーション初期化開始');
    
    // LINEメッセージフロー表示のアニメーション - マーカーを削除
    if (DOM.lineMessagingSection) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.line-messaging-section',
                start: 'top center',
                end: 'bottom center',
                scrub: true, // スクロールに完全同期
                markers: false, // マーカーを非表示に変更
                onEnter: () => console.log('LINE メッセージフローアニメーション開始'),
                onLeave: () => console.log('LINE メッセージフローアニメーション終了')
            }
        })
        .from('.line-message-1', { opacity: 0, y: 20, duration: 0.5 }) // 距離を短縮
        .from('.line-message-2', { opacity: 0, y: 20, duration: 0.5 }) // 距離を短縮
        .from('.line-message-3', { opacity: 0, y: 20, duration: 0.5 }) // 距離を短縮
        .to('.spreadsheet-icon', { scale: 1.1, duration: 0.3 }) // スケールを小さく
        .from('.data-flow-arrow', { drawSVG: 0, duration: 1 })
        .from('.spreadsheet-data', { opacity: 0, y: 10, stagger: 0.2, duration: 0.8 }); // 距離を短縮
    }
    
    // Before/After比較アニメーション - マーカーを削除
    if (DOM.comparisonSection) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.comparison-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                markers: false, // マーカーを非表示に変更
                onEnter: () => console.log('比較アニメーション開始'),
                onLeave: () => console.log('比較アニメーション終了')
            }
        })
        .from('.before-image', { x: -30, opacity: 0.5, duration: 1 }) // 距離を短縮
        .from('.after-image', { x: 30, opacity: 0, duration: 1 }, "-=0.8") // 距離を短縮
        .from('.comparison-arrow', { opacity: 0, scale: 0.7, duration: 0.5 }, "-=0.5") // スケールを大きく
        .from('.improvement-stats', { opacity: 0, y: 15, stagger: 0.2, duration: 0.8 }); // 距離を短縮
    }
    
    // 特徴セクションのパララックス効果 - 距離を短縮
    gsap.utils.toArray('.features-grid .feature-card').forEach((card, i) => {
        const direction = i % 2 === 0 ? -15 : 15; // 距離を半分に
        
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                end: 'bottom top+=100',
                scrub: 1
            },
            y: direction,
            opacity: 0.8, // 不透明度を上げる
            duration: 1.5
        });
    });
    
    console.log('GSAP アニメーション初期化完了');
} 