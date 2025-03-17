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

    // スクロールアニメーション
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });

        // 時間削減グラフのアニメーション
        const timeProgress = document.querySelector('.time-saved-progress');
        if (timeProgress) {
            const timeProgressPosition = timeProgress.getBoundingClientRect().top;
            if (timeProgressPosition < windowHeight - 100) {
                const percentage = timeProgress.getAttribute('data-percentage');
                timeProgress.style.width = percentage + '%';
            }
        }
    };

    // 初期実行
    animateOnScroll();

    // スクロール時に実行
    window.addEventListener('scroll', animateOnScroll);

    // Animate.cssを使用した要素に対して、スクロール時にアニメーションを適用
    const animateElements = document.querySelectorAll('.problem-card, .feature-card, .role-card, .implementation-step, .pricing-card');
    animateElements.forEach(function(element) {
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
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(inquiryForm);
            const formDataObj = {};
            formData.forEach(function(value, key) {
                formDataObj[key] = value;
            });
            
            // 送信中の表示
            const submitButton = inquiryForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;
            
            // 実際のAPIエンドポイントに送信する場合はここでfetchなどを使用
            // ここではデモとして成功したことにする
            setTimeout(function() {
                // 送信完了の表示
                submitButton.textContent = '送信完了!';
                submitButton.style.backgroundColor = 'var(--success-color)';
                
                // フォームをリセット
                inquiryForm.reset();
                
                // 元に戻す
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
                
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
            }, 2000);
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