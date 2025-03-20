/**
 * LINEでカンタン勤怠 - 縦型スワイプLP用スクリプト
 * 警備業界向け勤怠管理システム紹介サイト
 */

// DOMコンテンツ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // デバイスの判定
  const isMobile = window.innerWidth <= 768;
  console.log(`デバイス検出: ${isMobile ? 'モバイル' : 'PC'}`);
  
  // DOM要素の取得
  const elements = {
    // section要素のうち、id属性が'section1'から始まるものすべてを取得
    sections: document.querySelectorAll('section[id^="section"]'),
    navDots: document.querySelectorAll('.section-navigation li'),
    navLinks: document.querySelectorAll('.nav-link, .footer-nav-link'),
    menuToggle: document.querySelector('.menu-toggle'),
    mainNav: document.querySelector('.main-nav'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    scrollIndicators: document.querySelectorAll('.scroll-indicator'),
    header: document.querySelector('.header'),
    efficiencyBar: document.querySelector('.efficiency-progress')
  };
  
  // 状態管理
  const state = {
    currentSection: 0,
    isScrolling: false,
    lastScrollTime: 0,
    touchStartY: 0,
    touchEndY: 0,
    wheelDirection: 0,
    scrollDelay: 1000, // ms（800msから1000msに変更）
    touchThreshold: 50, // px
    isMobileMenuOpen: false
  };
  
  /**
   * 初期化関数
   */
  function init() {
    console.log('縦型スワイプLP初期化');
    
    // セクションの数をコンソールに出力
    console.log(`検出されたセクション数: ${elements.sections.length}`);
    elements.sections.forEach((section, i) => {
      console.log(`セクション ${i+1}: id=${section.id}, class=${section.className}`);
    });
    
    // スタイルのリセット - 既存の設定をクリア
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.classList.remove('no-scroll');
    
    elements.sections.forEach(section => {
      section.style.position = '';
      section.style.display = '';
      section.style.opacity = '';
      section.style.visibility = '';
      section.style.minHeight = '';
      section.style.width = '';
      section.style.overflow = '';
      section.style.top = '';
      section.style.left = '';
    });
    
    // PCとモバイルで別々の初期化処理
    if (isMobile) {
      // モバイル向け初期化: 標準のスクロールを使用
      initMobile();
    } else {
      // PC向け初期化: フルスクリーンスクロールを設定
      initDesktop();
    }
    
    // 共通の初期化処理
    setupCommonFeatures();
  }
  
  /**
   * モバイル向け初期化処理
   */
  function initMobile() {
    console.log('モバイルモードで初期化');
    
    // HTML, Bodyのオーバーフローをautoに設定（標準スクロールを許可）
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    // メインコンテンツをフルスクリーンスクロールから通常スクロールに変更
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.height = 'auto';
      mainContent.style.overflow = 'visible';
    }
    
    // 各セクションを通常表示に変更
    elements.sections.forEach(section => {
      section.style.position = 'relative';
      section.style.display = 'flex';
      section.style.opacity = '1';
      section.style.visibility = 'visible';
      section.style.height = 'auto';  // 高さを自動に設定
      section.style.minHeight = 'auto'; // 最小高さの制限を解除
      section.classList.add('active');
    });
    
    // スクロールインジケーターを非表示
    elements.scrollIndicators.forEach(indicator => {
      indicator.style.display = 'none';
    });
    
    // ヘッダースクロール検出
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 50) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
      
      // スクロール位置に基づいてアクティブセクションを更新
      updateActiveSection();
    }, 100));
    
    // 初期表示時にアニメーション要素を表示
    setTimeout(() => {
      const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
      fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
          element.classList.add('active');
        }
      });
    }, 300);
    
    // スクロールでアニメーション要素の表示を制御
    window.addEventListener('scroll', throttle(() => {
      const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
      fadeElements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('active')) {
          element.classList.add('active');
        }
      });
    }, 100));
  }
  
  /**
   * 要素が表示領域内にあるかをチェック
   * @param {HTMLElement} element - チェックする要素
   * @return {boolean} - 要素が表示領域内にあるかどうか
   */
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  /**
   * スクロール位置からアクティブなセクションを更新（モバイル用）
   */
  function updateActiveSection() {
    let currentSection = '';
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    elements.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });
    
    if (currentSection) {
      // ナビゲーションドットの更新
      elements.navDots.forEach(dot => {
        const dotSection = dot.getAttribute('data-section');
        if (dotSection === currentSection) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // モバイルナビのアクティブ状態更新
      const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
      if (mobileBottomNav) {
        const links = mobileBottomNav.querySelectorAll('a');
        links.forEach(link => {
          const linkHref = link.getAttribute('href').substring(1);
          if (linkHref === currentSection) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }
  }
  
  /**
   * PC向け初期化処理
   */
  function initDesktop() {
    console.log('PCモードで初期化');
    
    // セクションの初期配置
    setupSections();
    
    // 初期セクションをアクティブに
    activateSection(0);
    
    // フルスクリーンスクロール用のイベントリスナー
    setupDesktopEventListeners();
    
    // URLハッシュによる初期セクション表示
    handleUrlHash();
    
    // 初期セクションを強制的に表示
    setTimeout(() => {
      scrollToSection(0, false);
    }, 100);
  }
  
  /**
   * PC用のセクション初期配置を設定
   */
  function setupSections() {
    // 各セクションを非表示に初期化
    elements.sections.forEach((section, index) => {
      // セクションのスタイルを調整して全画面表示に
      if (!section.classList.contains('fullscreen-section')) {
        section.classList.add('fullscreen-section');
        
        // スタイルを修正 - すべてのセクションが同じスタイルを持つよう調整
        section.style.position = 'absolute'; // absoluteに変更
        section.style.top = '0';
        section.style.left = '0';
        section.style.minHeight = '100vh';
        section.style.width = '100%';
        section.style.overflow = 'hidden';
      }
      
      if (index !== 0) {
        section.style.display = 'none';
        section.style.opacity = '0';
        section.style.visibility = 'hidden';
      } else {
        section.style.display = '';
        section.style.opacity = '1';
        section.style.visibility = 'visible';
      }
      section.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
    });

    // 最初のセクションだけ表示
    if (elements.sections[0]) {
      elements.sections[0].style.display = '';
      elements.sections[0].classList.add('active');
    }

    // bodyにno-scrollクラスを追加してスクロールを防止
    document.documentElement.classList.add('no-scroll');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * PC用イベントリスナーの設定
   */
  function setupDesktopEventListeners() {
    // ホイールスクロール
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // タッチイベント
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // キーボードナビゲーション
    document.addEventListener('keydown', handleKeyDown);
    
    // ナビゲーションドット
    elements.navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => scrollToSection(index));
      
      // キーボードアクセシビリティ
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `セクション ${index + 1} へ移動`);
      
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToSection(index);
        }
      });
    });
    
    // ナビゲーションリンク
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetIndex = Array.from(elements.sections).findIndex(section => section.id === targetId);
        
        if (targetIndex !== -1) {
          scrollToSection(targetIndex);
          
          // モバイルメニューを閉じる
          elements.mainNav.classList.remove('active');
        }
      });
    });
    
    // モバイルメニューのナビゲーションリンク
    elements.mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetIndex = Array.from(elements.sections).findIndex(section => section.id === targetId);
        
        if (targetIndex !== -1) {
          scrollToSection(targetIndex);
          
          // モバイルメニューを閉じる
          toggleMobileMenu(false);
        }
      });
    });
    
    // スクロールインジケーター
    elements.scrollIndicators.forEach(indicator => {
      // インジケーター自体のクリックイベント
      indicator.addEventListener('click', () => {
        const hasUpArrow = indicator.innerHTML.includes('fa-chevron-up');
        
        if (hasUpArrow) {
          scrollToSection(0);
        } else {
          scrollToSection(state.currentSection + 1);
        }
      });
      
      // インジケーター内の要素のクリックイベント
      const childElements = indicator.querySelectorAll('span, i');
      childElements.forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation(); // イベント伝播を防止
          const hasUpArrow = indicator.innerHTML.includes('fa-chevron-up');
        
          if (hasUpArrow) {
            scrollToSection(0);
          } else {
            scrollToSection(state.currentSection + 1);
          }
        });
      });
    });
    
    // スクロール時のヘッダー表示制御
    window.addEventListener('scroll', throttle(() => {
      // ヘッダー表示制御
      if (window.scrollY > 50) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
      
      // スクロール位置に基づいてナビゲーション目印を更新
      if (!state.isScrolling) {
        checkScrollPosition();
      }
    }, 100));
  }
  
  /**
   * 共通機能の設定
   */
  function setupCommonFeatures() {
    // 進捗バーの初期化（存在すれば）
    if (elements.efficiencyBar) {
      setTimeout(() => {
        const percentage = elements.efficiencyBar.dataset.percent || '0';
        elements.efficiencyBar.style.width = `${percentage}%`;
      }, 1000);
    }
    
    // メニュートグル
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', () => {
        toggleMobileMenu();
      });
    }
    
    // リサイズイベント
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // 画面幅が768pxを超えたか以下になった場合のみリロード
        const currentIsMobile = window.innerWidth <= 768;
        if (currentIsMobile !== isMobile) {
          console.log('デバイスモードが変更されました。ページをリロードします。');
          window.location.reload();
        }
      }, 250);
    });
    
    // モバイルメニューが開いているときに画面外をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
      if (state.isMobileMenuOpen && 
          !elements.mobileMenu.contains(e.target) && 
          !elements.menuToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
    
    // 料金プランのカルーセル（モバイル用）
    const pricingGrid = document.querySelector('#section5 .grid');
    const pricingDots = document.querySelectorAll('.scroll-dots .dot');
    
    if (isMobile && pricingGrid && pricingDots.length) {
      // スクロール検出
      pricingGrid.addEventListener('scroll', function() {
        const scrollPosition = this.scrollLeft;
        const cardWidth = this.querySelector('div').offsetWidth;
        const index = Math.round(scrollPosition / cardWidth);
        
        pricingDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      });
      
      // ドットクリックでプラン移動
      pricingDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
          const cardWidth = pricingGrid.querySelector('div').offsetWidth;
          pricingGrid.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
          });
        });
      });
    }
  }
  
  /**
   * ナビゲーション目印の状態を更新
   * @param {number} index - アクティブなセクションのインデックス
   */
  function updateNavigationDots(index) {
    console.log(`ナビゲーション目印を更新: セクション ${index + 1}`);
    
    elements.navDots.forEach((dot, i) => {
      // ナビゲーションドットとセクションの数が一致しない場合の対策
      if (i >= elements.sections.length) return;
      
      if (i === index) {
        // アクティブなドットの設定
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
        
        // Tailwindのdata-* スタイルが適用されるよう明示的にdata属性を設定
        const sectionId = elements.sections[i].id;
        dot.setAttribute('data-section', sectionId);
        
        console.log(`ナビドット ${i+1} をアクティブにしました (セクション: ${sectionId})`);
      } else {
        // 非アクティブなドットの設定
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
      }
    });
  }
  
  /**
   * セクションをアクティブにする
   * @param {number} index - アクティブにするセクションのインデックス
   */
  function activateSection(index) {
    if (index < 0 || index >= elements.sections.length) return;
    
    console.log(`セクション ${index + 1} をアクティブにします...`);
    
    // 全セクションのアクティブ状態をリセット
    elements.sections.forEach((section, i) => {
      if (i === index) {
        // アクティブなセクションの設定
        section.style.display = '';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.style.zIndex = '10';
        section.classList.add('active');
        section.setAttribute('aria-hidden', 'false');
      } else {
        // 非アクティブなセクションの設定
        section.style.display = 'none';
        section.style.visibility = 'hidden';
        section.style.opacity = '0';
        section.style.zIndex = '1';
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
      }
    });
    
    // ナビゲーション目印の更新
    updateNavigationDots(index);
    
    // スクロールインジケーターの表示を更新
    updateScrollIndicators(index);
    
    // セクション内の要素のアニメーション
    animateSectionElements(elements.sections[index]);
    
    // 状態更新
    state.currentSection = index;
    
    // URLハッシュの更新
    const sectionId = elements.sections[index].id;
    history.replaceState(null, null, `#${sectionId}`);

    console.log(`セクション ${index + 1} (${sectionId}) をアクティベート完了`);
  }
  
  /**
   * セクション内の要素のアニメーション
   * @param {HTMLElement} section - アニメーションするセクション要素
   */
  function animateSectionElements(section) {
    // フェードイン要素を検索
    const fadeElements = section.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    
    // 一旦すべてリセット
    fadeElements.forEach(element => {
        element.classList.remove('active');
    });
    
    // 少し遅延を付けて再アニメーション
    setTimeout(() => {
        fadeElements.forEach((element, index) => {
            // データ属性から遅延時間を取得、なければインデックスに基づいて計算
            const delay = element.dataset.delay ? parseInt(element.dataset.delay) : (index * 150);
            
            setTimeout(() => {
                element.classList.add('active');
            }, delay);
        });
        
        // 削減バーのアニメーション - シンプル化
        const reductionBar = section.querySelector('.reduction-bar');
        if (reductionBar) {
            // テキスト要素を取得
            const textElement = section.querySelector('.reduction-text');
            if (textElement) {
                textElement.textContent = '-80%';
            }
            
            // 最初から緑色で設定
            reductionBar.style.transition = 'none';
            reductionBar.style.width = '100%';
            reductionBar.style.backgroundColor = '#00B900'; // 緑色
            
            // 強制的にレイアウト計算を実行させる
            void reductionBar.offsetWidth;
            
            // 幅の変更アニメーションのみ実行
            setTimeout(() => {
                reductionBar.style.transition = 'width 2s ease-in-out';
                reductionBar.style.width = '20%';
                
                // アニメーション完了後にテキスト更新
                setTimeout(() => {
                    if (textElement) {
                        textElement.textContent = '効率化完了!';
                    }
                }, 2000);
            }, 300);
        }
    }, 200);
  }
  
  /**
   * スクロールインジケーターの表示を更新
   * @param {number} index - 現在のセクションインデックス
   */
  function updateScrollIndicators(index) {
    const isLastSection = index === elements.sections.length - 1;
    
    console.log(`スクロールインジケーター更新: 現在のセクション=${index+1}, 最終セクション=${isLastSection}`);
    
    elements.scrollIndicators.forEach(indicator => {
      const hasUpArrow = indicator.innerHTML.includes('fa-chevron-up');
      const hasDownArrow = indicator.innerHTML.includes('fa-chevron-down');
      
      console.log(`インジケーター: 上矢印=${hasUpArrow}, 下矢印=${hasDownArrow}`);
      
      // 最後のセクションでかつ上向き矢印を持つインジケーター
      if (isLastSection && hasUpArrow) {
        indicator.style.display = 'flex';
        console.log('最終セクション用の上矢印インジケーターを表示');
      } 
      // 最後のセクション以外で下向き矢印を持つインジケーター
      else if (!isLastSection && hasDownArrow) {
        indicator.style.display = 'flex';
        console.log('通常セクション用の下矢印インジケーターを表示');
      }
      // それ以外は非表示
      else {
        indicator.style.display = 'none';
      }
    });
  }
  
  /**
   * 特定のセクションにスクロール
   * @param {number} index - スクロール先のセクションインデックス
   * @param {boolean} useDelay - 遅延を使用するか
   */
  function scrollToSection(index, useDelay = true) {
    // 範囲外、同じセクション、スクロール中はスキップ
    if (
      index < 0 || 
      index >= elements.sections.length || 
      index === state.currentSection || 
      state.isScrolling
    ) {
      return;
    }
    
    // スクロール状態を更新
    state.isScrolling = true;
    
    // セクション活性化
    activateSection(index);
    
    // 遅延後にスクロール状態をリセット
    if (useDelay) {
      setTimeout(() => {
        state.isScrolling = false;
      }, state.scrollDelay);
    } else {
      state.isScrolling = false;
    }
  }
  
  /**
   * ホイールイベントのハンドラー
   * @param {WheelEvent} event - ホイールイベント
   */
  function handleWheel(event) {
    event.preventDefault();
    
    const currentTime = Date.now();
    
    // スクロール間隔の制御（連続スクロール防止）
    if (currentTime - state.lastScrollTime < state.scrollDelay || state.isScrolling) {
      return;
    }
    
    state.lastScrollTime = currentTime;
    
    // スクロール方向の判定
    if (event.deltaY > 0) {
      // 下にスクロール
      if (state.currentSection < elements.sections.length - 1) {
        scrollToSection(state.currentSection + 1);
      }
    } else {
      // 上にスクロール
      if (state.currentSection > 0) {
        scrollToSection(state.currentSection - 1);
      }
    }
  }
  
  /**
   * タッチスタートイベントのハンドラー
   * @param {TouchEvent} event - タッチスタートイベント
   */
  function handleTouchStart(event) {
    state.touchStartY = event.touches[0].clientY;
  }
  
  /**
   * タッチムーブイベントのハンドラー
   * @param {TouchEvent} event - タッチムーブイベント
   */
  function handleTouchMove(event) {
    // スクロール中は追加の移動を防止
    if (state.isScrolling) {
      event.preventDefault();
    }
  }
  
  /**
   * タッチエンドイベントのハンドラー
   * @param {TouchEvent} event - タッチエンドイベント
   */
  function handleTouchEnd(event) {
    // スクロール中は無視
    if (state.isScrolling) return;
    
    const currentTime = Date.now();
    
    // スクロール間隔の制御
    if (currentTime - state.lastScrollTime < state.scrollDelay) {
      return;
    }
    
    state.lastScrollTime = currentTime;
    state.touchEndY = event.changedTouches[0].clientY;
    const diffY = state.touchStartY - state.touchEndY;
    
    // スワイプが十分な距離があるか確認
    if (Math.abs(diffY) > state.touchThreshold) {
      if (diffY > 0) {
        // 下にスワイプ
        if (state.currentSection < elements.sections.length - 1) {
          scrollToSection(state.currentSection + 1);
        }
      } else {
        // 上にスワイプ
        if (state.currentSection > 0) {
          scrollToSection(state.currentSection - 1);
        }
      }
    }
  }
  
  /**
   * キーボードイベントのハンドラー
   * @param {KeyboardEvent} event - キーボードイベント
   */
  function handleKeyDown(event) {
    // メニューが開いている場合は操作しない
    if (elements.mainNav && elements.mainNav.classList.contains('active')) {
      return;
    }
    
    // フォーム要素にフォーカスがある場合は操作しない
    if (
      document.activeElement.tagName === 'INPUT' || 
      document.activeElement.tagName === 'TEXTAREA' || 
      document.activeElement.tagName === 'SELECT'
    ) {
      return;
    }
    
    const currentTime = Date.now();
    
    // スクロール間隔の制御
    if (currentTime - state.lastScrollTime < state.scrollDelay || state.isScrolling) {
      return;
    }
    
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      // 下に移動
      event.preventDefault();
      if (state.currentSection < elements.sections.length - 1) {
        scrollToSection(state.currentSection + 1);
        state.lastScrollTime = currentTime;
      }
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      // 上に移動
      event.preventDefault();
      if (state.currentSection > 0) {
        scrollToSection(state.currentSection - 1);
        state.lastScrollTime = currentTime;
      }
    } else if (event.key === 'Home') {
      // 最初のセクションへ
      event.preventDefault();
      scrollToSection(0);
      state.lastScrollTime = currentTime;
    } else if (event.key === 'End') {
      // 最後のセクションへ
      event.preventDefault();
      scrollToSection(elements.sections.length - 1);
      state.lastScrollTime = currentTime;
    }
  }
  
  /**
   * URLハッシュに基づいたセクション表示
   */
  function handleUrlHash() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetIndex = Array.from(elements.sections).findIndex(section => section.id === targetId);
      
      if (targetIndex !== -1) {
        // 遅延を付けて初期セクションを設定
        setTimeout(() => {
          activateSection(targetIndex);
        }, 100);
      }
    }
  }
  
  /**
   * スクロール位置に基づいてナビゲーション目印を更新
   */
  function checkScrollPosition() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    // 各セクションをチェックして、現在のスクロール位置に最も近いセクションを特定
    for (let i = 0; i < elements.sections.length; i++) {
      const section = elements.sections[i];
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      // スクロール位置がセクション内にある場合、そのセクションをアクティブにする
      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        if (state.currentSection !== i) {
          // スクロール位置に基づいて現在のセクションが変更された場合のみナビゲーション目印を更新
          updateNavigationDots(i);
          state.currentSection = i;
        }
        break;
      }
    }
  }
  
  /**
   * ユーティリティ関数: デバウンス
   * @param {Function} func - 実行する関数
   * @param {number} delay - 遅延時間 (ms)
   * @return {Function} - デバウンスされた関数
   */
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  /**
   * ユーティリティ関数: スロットリング
   * @param {Function} func - 実行する関数
   * @param {number} limit - 最低間隔 (ms)
   * @return {Function} - スロットリングされた関数
   */
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
  
  /**
   * モバイルメニューの開閉を制御する関数
   * @param {boolean|undefined} forceState - 強制的に開くか閉じるかの状態 (未指定の場合はトグル)
   */
  function toggleMobileMenu(forceState) {
    const menuToggle = elements.menuToggle;
    const mobileMenu = elements.mobileMenu;
    
    if (menuToggle && mobileMenu) {
      // forceStateが指定されている場合はその値を使用、そうでなければ現在の状態を反転
      const newState = forceState !== undefined ? forceState : !state.isMobileMenuOpen;
      
      menuToggle.classList.toggle('active', newState);
      mobileMenu.classList.toggle('active', newState);
      state.isMobileMenuOpen = newState;
      
      // スクロール制御（モバイルメニュー表示時はスクロール禁止）
      // isMobileがtrueの場合のみ適用（PC表示ではスクロール状態を変更しない）
      if (isMobile) {
        document.body.style.overflow = newState ? 'hidden' : 'auto';
      }
    }
  }
  
  // アプリケーション初期化
  init();
}); 
