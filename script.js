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
                nextSection.scrollIntoView({ behavior: 'smooth' });
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

    // 初期表示要素のアニメーションを発火
    function triggerInitialAnimations() {
        // ヒーローセクションの要素のみ初期表示時にアニメーション
        const initialElements = document.querySelectorAll('.hero-content h1, .hero-content h2, .hero-content p, .hero-buttons, .hero-image');
        initialElements.forEach(function(element) {
            if (!element.classList.contains('animated')) {
                const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                const animationDelay = element.getAttribute('data-delay') || '';
                
                element.classList.add('animate__animated', animationClass);
                if (animationDelay) {
                    element.classList.add(animationDelay);
                }
                element.classList.add('animated');
            }
        });
    }

    // Intersection Observerを使用したスクロールアニメーション
    const setupIntersectionObserver = function() {
        const options = {
            root: null, // ビューポートをルートとして使用
            rootMargin: '0px 0px -150px 0px', // 要素が150px表示されたらコールバックを実行（画面下部から150px入ったところ）
            threshold: 0.15 // 要素の15%が見えたらコールバックを実行（より確実に表示されてから）
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
                        }, 50);
                    }
                    
                    // 一度アニメーションが実行されたら監視を解除
                    observer.unobserve(element);
                }
            });
        }, options);

        // animate-on-scroll クラスを持つ要素を監視（ヒーローセクション以外）
        const elements = document.querySelectorAll('.animate-on-scroll:not(.hero-content *):not(.hero-image)');
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
                    }, 100);
                    
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
            if (elementPosition < windowHeight - 150) {
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
                    }, 50);
                }
            }
        });

        // 時間削減グラフのアニメーション
        const timeProgress = document.querySelector('.time-saved-progress');
        if (timeProgress && !timeProgress.style.width) {
            const timeProgressPosition = timeProgress.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (timeProgressPosition < windowHeight - 150) {
                setTimeout(() => {
                    const percentage = timeProgress.getAttribute('data-percentage');
                    timeProgress.style.width = percentage + '%';
                }, 100);
            }
        }
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

    // 画像のホバーエフェクト
    const images = document.querySelectorAll('.step-image img, .comparison-image img, .case-study-image img');
    images.forEach(function(img) {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // スムーズスクロール
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
                const step = target / (duration / 16); // 16msごとの増加量
                
                let current = 0;
                const timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        clearInterval(timer);
                        current = target;
                    }
                    element.textContent = Math.floor(current);
                }, 16);
            }
        });
    };
    
    // 初期実行
    countUp();
    
    // スクロール時に実行
    window.addEventListener('scroll', countUp);

    // 画像のLazyロード
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoad = function() {
        lazyImages.forEach(function(img) {
            if (img.getBoundingClientRect().top < window.innerHeight + 300) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            }
        });
    };
    
    // 初期実行
    lazyLoad();
    
    // スクロール時に実行
    window.addEventListener('scroll', lazyLoad);

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
    window.addEventListener('scroll', parallax);
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