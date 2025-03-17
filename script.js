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
                
                // テキストスプリットアニメーションを初期化
                initSplitTextAnimations();
                
                // パララックス効果を初期化
                initParallaxEffects();
                
                // 3Dカード効果を初期化
                init3DCardEffects();
            }, 500);
        }, 500);
    });

    // スクロールダウンアニメーション
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollDown = document.createElement('div');
        scrollDown.className = 'scroll-down';
        scrollDown.innerHTML = `
            <span>スクロールして詳細を見る</span>
            <div class="scroll-down-arrow"></div>
        `;
        hero.appendChild(scrollDown);

        // スクロールダウンをクリックしたら次のセクションへスクロール
        scrollDown.addEventListener('click', function() {
            const nextSection = document.querySelector('.problems');
            if (nextSection) {
                smoothScrollTo(nextSection);
            }
        });
    }

    // ヘッダーのスクロール効果
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // モバイルメニューの切り替え
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // メニューリンクをクリックしたらメニューを閉じる
        const menuLinks = mainNav.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            });
        });
    }

    // スロットリング関数 - スクロールイベントの頻度を制限
    function throttle(callback, delay) {
        let isThrottled = false;
        return function() {
            if (isThrottled) return;
            
            isThrottled = true;
            const context = this;
            const args = arguments;
            
            setTimeout(function() {
                callback.apply(context, args);
                isThrottled = false;
            }, delay);
        };
    }

    // スムーズスクロール関数
    function smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - header.offsetHeight;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeOutExpo(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        
        requestAnimationFrame(animation);
    }

    // 初期表示要素のアニメーションを発火
    function triggerInitialAnimations() {
        // ヒーローセクションの要素のみ初期表示時にアニメーション
        const initialElements = document.querySelectorAll('.hero-content h1, .hero-content h2, .hero-content p, .hero-buttons, .hero-image');
        
        // 要素ごとに遅延を設定してアニメーション
        initialElements.forEach(function(element, index) {
            if (!element.classList.contains('animated')) {
                setTimeout(() => {
                    const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                    const animationDelay = element.getAttribute('data-delay') || '';
                    
                    element.classList.add('animate__animated', animationClass);
                    if (animationDelay) {
                        element.classList.add(animationDelay);
                    }
                    element.classList.add('animated');
                }, index * 150); // 各要素に150msの遅延を追加
            }
        });
    }

    // テキストスプリットアニメーションの初期化
    function initSplitTextAnimations() {
        // セクションタイトルをスプリットテキスト化
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(function(title) {
            // テキストを文字単位に分割
            const text = title.textContent;
            title.textContent = '';
            title.classList.add('text-reveal');
            
            const textWrapper = document.createElement('span');
            textWrapper.className = 'text-wrapper';
            title.appendChild(textWrapper);
            
            // 各文字をspanで囲む
            for (let i = 0; i < text.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.style.transitionDelay = `${i * 0.03}s`; // 文字ごとに遅延を設定
                charSpan.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // スペースを&nbsp;に置換
                textWrapper.appendChild(charSpan);
            }
        });
    }

    // パララックス効果の初期化
    function initParallaxEffects() {
        // パララックス効果を適用する要素
        const parallaxElements = document.querySelectorAll('.hero-image, .comparison-image, .demo-qr, .case-study-image');
        parallaxElements.forEach(function(element) {
            element.classList.add('parallax-element');
            
            // 親要素にパララックスコンテナクラスを追加
            const parent = element.parentElement;
            if (parent && !parent.classList.contains('parallax-container')) {
                parent.classList.add('parallax-container');
            }
        });
        
        // マウス移動に応じたパララックス効果
        document.addEventListener('mousemove', throttle(function(e) {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            parallaxElements.forEach(function(element) {
                const speed = element.getAttribute('data-parallax-speed') || 20;
                const x = mouseX * speed;
                const y = mouseY * speed;
                element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        }, 50));
    }

    // 3Dカード効果の初期化
    function init3DCardEffects() {
        // 3D効果を適用するカード要素
        const cards = document.querySelectorAll('.problem-card, .feature-card, .role-card, .pricing-card');
        cards.forEach(function(card) {
            card.classList.add('card-3d');
            
            // マウスの動きに応じた3D効果
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // カード内のX座標
                const y = e.clientY - rect.top; // カード内のY座標
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10; // Y軸の回転角度
                const rotateY = (centerX - x) / 10; // X軸の回転角度
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            // マウスが離れたら元に戻す
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // Intersection Observerを使用したスクロールアニメーション
    const setupIntersectionObserver = function() {
        const options = {
            root: null, // ビューポートをルートとして使用
            rootMargin: '0px 0px -100px 0px', // 要素が100px表示されたらコールバックを実行
            threshold: 0.1 // 要素の10%が見えたらコールバックを実行
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // ヒーローセクション内の要素は初期表示で処理するため、ここではスキップ
                    if (element.closest('.hero')) {
                        observer.unobserve(element);
                        return;
                    }
                    
                    // アニメーションクラスを追加
                    if (!element.classList.contains('animated')) {
                        // データ属性からアニメーション名を取得
                        const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                        const animationDelay = element.getAttribute('data-delay') || '';
                        
                        // アニメーション適用前に少し遅延を入れる（スクロール後に発火するように）
                        setTimeout(() => {
                            element.classList.add('animate__animated', animationClass);
                            if (animationDelay) {
                                element.classList.add(animationDelay);
                            }
                            element.classList.add('animated');
                            
                            // テキストスプリットアニメーションの場合
                            if (element.classList.contains('text-reveal')) {
                                const chars = element.querySelectorAll('.char');
                                chars.forEach(char => char.classList.add('animated'));
                            }
                        }, 100);
                    }
                    
                    // 一度アニメーションが実行されたら監視を解除
                    observer.unobserve(element);
                }
            });
        }, options);

        // animate-on-scroll クラスを持つ要素を監視（ヒーローセクション以外）
        const elements = document.querySelectorAll('.animate-on-scroll:not(.hero-content *):not(.hero-image), .text-reveal');
        elements.forEach(element => {
            observer.observe(element);
        });

        return observer;
    };

    // 時間削減グラフのアニメーション用Intersection Observer
    const setupProgressObserver = function() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px', // 画面下部から100px入ったところ
            threshold: 0.4 // 要素の40%が見えたらコールバックを実行
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timeProgress = entry.target;
                    
                    // アニメーション適用前に少し遅延を入れる
                    setTimeout(() => {
                        const percentage = timeProgress.getAttribute('data-percentage');
                        timeProgress.style.width = percentage + '%';
                        timeProgress.classList.add('animated');
                    }, 300);
                    
                    // 一度アニメーションが実行されたら監視を解除
                    observer.unobserve(timeProgress);
                }
            });
        }, options);

        // 時間削減グラフを監視
        const timeProgress = document.querySelector('.time-saved-progress');
        if (timeProgress) {
            observer.observe(timeProgress);
        }

        return observer;
    };

    // 従来のスクロールアニメーション（フォールバック）
    const animateOnScroll = function() {
        // animate-on-scroll クラスを持つ要素のアニメーション（ヒーローセクション以外）
        const elements = document.querySelectorAll('.animate-on-scroll:not(.hero-content *):not(.hero-image):not(.animated)');
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            // 要素がより画面内に入ってからアニメーション発火
            if (elementPosition < windowHeight - 100) {
                // アニメーションクラスを追加
                if (!element.classList.contains('animated')) {
                    // データ属性からアニメーション名を取得
                    const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                    const animationDelay = element.getAttribute('data-delay') || '';
                    
                    // アニメーション適用前に少し遅延を入れる
                    setTimeout(() => {
                        element.classList.add('animate__animated', animationClass);
                        if (animationDelay) {
                            element.classList.add(animationDelay);
                        }
                        element.classList.add('animated');
                    }, 100);
                }
            }
        });

        // 時間削減グラフのアニメーション
        const timeProgress = document.querySelector('.time-saved-progress');
        if (timeProgress && !timeProgress.style.width) {
            const timeProgressPosition = timeProgress.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (timeProgressPosition < windowHeight - 100) {
                setTimeout(() => {
                    const percentage = timeProgress.getAttribute('data-percentage');
                    timeProgress.style.width = percentage + '%';
                    timeProgress.classList.add('animated');
                }, 300);
            }
        }
        
        // テキストスプリットアニメーション
        const textReveals = document.querySelectorAll('.text-reveal:not(.animated)');
        textReveals.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
                const chars = element.querySelectorAll('.char');
                chars.forEach(char => char.classList.add('animated'));
            }
        });
    };

    // Intersection Observerをサポートしているブラウザでは、それを使用
    if ('IntersectionObserver' in window) {
        const animationObserver = setupIntersectionObserver();
        const progressObserver = setupProgressObserver();
    } else {
        // フォールバック: 従来のスクロールイベントベースのアニメーション
        // 初期実行
        animateOnScroll();
        
        // スクロール時に実行（スロットリング適用）
        window.addEventListener('scroll', throttle(animateOnScroll, 100));
    }

    // Animate.cssを使用する要素に対して、animate-on-scrollクラスを追加
    const animateElements = document.querySelectorAll('.hero-content h1, .hero-content h2, .hero-content p, .hero-buttons, .hero-image, .problem-card, .feature-card, .role-card, .implementation-step, .pricing-card, .step-card, .comparison-before, .comparison-after, .demo-content, .demo-cta, .case-study-content, .contact-content, .faq-item');
    animateElements.forEach(function(element) {
        // 既存のアニメーションクラスを保存
        const classes = Array.from(element.classList);
        let animationClass = '';
        let animationDelay = '';
        
        // アニメーションクラスとディレイクラスを検出
        classes.forEach(function(className) {
            if (className.startsWith('animate__') && className !== 'animate__animated') {
                if (className.includes('delay')) {
                    animationDelay = className;
                } else {
                    animationClass = className;
                }
            }
        });
        
        // アニメーションクラスを削除
        if (element.classList.contains('animate__animated')) {
            element.classList.remove('animate__animated');
        }
        
        if (animationClass) {
            element.classList.remove(animationClass);
            element.setAttribute('data-animation', animationClass);
        }
        
        if (animationDelay) {
            element.classList.remove(animationDelay);
            element.setAttribute('data-delay', animationDelay);
        }
        
        // animate-on-scrollクラスを追加
        element.classList.add('animate-on-scroll');
    });

    // 新しいアニメーションタイプを適用
    const applyModernAnimations = function() {
        // 問題カードに回転アニメーションを適用
        const problemCards = document.querySelectorAll('.problem-card');
        problemCards.forEach((card, index) => {
            card.setAttribute('data-animation', 'animate__fadeInRotate');
            card.setAttribute('data-delay', `animate__delay-${index + 1}s`);
        });
        
        // 機能カードにポップアニメーションを適用
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.setAttribute('data-animation', 'animate__fadeInPop');
            card.setAttribute('data-delay', `animate__delay-${index + 1}s`);
        });
        
        // 料金カードにスケールアニメーションを適用
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach((card, index) => {
            card.setAttribute('data-animation', 'animate__fadeInScale');
            card.setAttribute('data-delay', `animate__delay-${index + 1}s`);
        });
        
        // 画像要素にズームエフェクトを適用
        const imageContainers = document.querySelectorAll('.step-image, .comparison-image, .case-study-image');
        imageContainers.forEach(container => {
            container.classList.add('img-hover-zoom');
        });
        
        // ボタン要素にホバーエフェクトを適用
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.classList.add('hover-float');
        });
    };
    
    // モダンなアニメーションを適用
    applyModernAnimations();

    // FAQのアコーディオン機能
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // 他のアイテムを閉じる
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // クリックしたアイテムの開閉
            item.classList.toggle('active');
        });
    });

    // お問い合わせフォームの送信処理
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            // フォームがFormspreeに送信されるため、ここでは特別な処理は不要
            // ただし、送信中の表示などのUX向上のための処理を追加
            const submitButton = inquiryForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;
            
            // 送信完了後の処理はFormspreeのリダイレクト設定で行うか、
            // または以下のようにカスタム処理を追加することも可能
            // この例ではコメントアウトしています
            /*
            e.preventDefault();
            
            // FormDataオブジェクトの作成
            const formData = new FormData(inquiryForm);
            
            // Fetch APIを使用してFormspreeにデータを送信
            fetch(inquiryForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // 送信成功時の処理
                submitButton.textContent = '送信完了!';
                submitButton.style.backgroundColor = 'var(--success-color)';
                inquiryForm.reset();
                
                // 成功メッセージの表示
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
                successMessage.style.color = 'var(--success-color)';
                successMessage.style.fontWeight = 'bold';
                successMessage.style.marginTop = '20px';
                successMessage.style.textAlign = 'center';
                
                // 既存のメッセージがあれば削除
                const existingMessage = inquiryForm.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                inquiryForm.appendChild(successMessage);
                
                // 元に戻す
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            })
            .catch(error => {
                // エラー時の処理
                console.error('Error:', error);
                submitButton.textContent = 'エラーが発生しました';
                submitButton.style.backgroundColor = 'var(--error-color)';
                
                // 元に戻す
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            });
            */
        });
    }

    // スムーズスクロール
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        });
    });

    // 数字のカウントアップアニメーション
    const countElements = document.querySelectorAll('.count-up');
    const countUp = function() {
        countElements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100 && !element.classList.contains('counted')) {
                element.classList.add('counted');
                
                const target = parseInt(element.getAttribute('data-target'));
                const duration = 2000; // 2秒間
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                const easeOutQuad = t => t * (2 - t); // イージング関数
                
                let frame = 0;
                const countToTarget = () => {
                    frame++;
                    const progress = easeOutQuad(frame / totalFrames);
                    const currentCount = Math.round(target * progress);
                    
                    if (currentCount === target) {
                        cancelAnimationFrame(countToTarget);
                    } else {
                        element.textContent = currentCount;
                        requestAnimationFrame(countToTarget);
                    }
                };
                
                requestAnimationFrame(countToTarget);
            }
        });
    };
    
    // 初期実行
    countUp();
    
    // スクロール時に実行
    window.addEventListener('scroll', throttle(countUp, 100));

    // 画像のLazyロード
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoad = function() {
        lazyImages.forEach(function(img) {
            if (img.getBoundingClientRect().top < window.innerHeight + 300) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                
                // 画像読み込み完了時にフェードインアニメーション
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                img.onload = function() {
                    img.style.opacity = '1';
                };
            }
        });
    };
    
    // 初期実行
    lazyLoad();
    
    // スクロール時に実行
    window.addEventListener('scroll', throttle(lazyLoad, 100));

    // パララックス効果
    const parallaxElements = document.querySelectorAll('.parallax');
    const parallax = function() {
        parallaxElements.forEach(function(element) {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    };
    
    // スクロール時に実行
    window.addEventListener('scroll', throttle(parallax, 50));
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