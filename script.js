/**
 * LINEでカンタン勤怠 - 縦型スワイプLP用スクリプト
 * 警備業界向け勤怠管理システム紹介サイト
 */

// DOMコンテンツ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
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
    
    // セクションの初期配置
    setupSections();
    
    // 初期セクションをアクティブに
    activateSection(0);
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // URLハッシュによる初期セクション表示
    handleUrlHash();
    
    // 進捗バーの初期化（存在すれば）
    if (elements.efficiencyBar) {
      setTimeout(() => {
        const percentage = elements.efficiencyBar.dataset.percent || '0';
        elements.efficiencyBar.style.width = `${percentage}%`;
      }, 1000);
    }

    // 初期セクションを強制的に表示
    setTimeout(() => {
      scrollToSection(0, false);
    }, 100);
  }
  
  /**
   * セクションの初期配置を設定
   */
  function setupSections() {
    // 各セクションを非表示に初期化
    elements.sections.forEach((section, index) => {
      // セクションのスタイルを調整して全画面表示に
      if (!section.classList.contains('fullscreen-section')) {
        section.classList.add('fullscreen-section');
        
        // スタイルを修正 - すべてのセクションが同じスタイルを持つよう調整
        if (!section.style.position || section.style.position !== 'relative') {
          section.style.position = 'relative';
        }
        
        if (!section.style.minHeight || section.style.minHeight !== '100vh') {
          section.style.minHeight = '100vh';
        }
        
        if (!section.style.width || section.style.width !== '100%') {
          section.style.width = '100%';
        }
        
        if (!section.style.overflow || section.style.overflow !== 'hidden') {
          section.style.overflow = 'hidden';
        }
      }
      
      if (index !== 0) {
        section.style.display = 'none';
      } else {
        // section.style.display = 'flex'だと、もともとdisplay: blockなどで設計されたセクションに
        // 問題が生じる可能性があるため、元のdisplayプロパティを尊重
        section.style.display = '';
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
  }
  
  /**
   * イベントリスナーの設定
   */
  function setupEventListeners() {
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
        
        console.log(`フッターリンクがクリックされました。targetId: ${targetId}, targetIndex: ${targetIndex}`); // 追加
        
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
    
    // スクロールインジケーター - インジケーター全体とその中の要素にもイベントを追加
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
      
      // インジケーター内のテキスト要素のクリックイベント（イベント伝播を防止）
      const textElements = indicator.querySelectorAll('span');
      textElements.forEach(textElement => {
        textElement.addEventListener('click', (e) => {
          e.stopPropagation(); // イベント伝播を防止
          const hasUpArrow = indicator.innerHTML.includes('fa-chevron-up');
        
          if (hasUpArrow) {
            scrollToSection(0);
          } else {
            scrollToSection(state.currentSection + 1);
          }
        });
      });
      
      // インジケーター内のアイコン要素のクリックイベント（イベント伝播を防止）
      const iconElements = indicator.querySelectorAll('i');
      iconElements.forEach(iconElement => {
        iconElement.addEventListener('click', (e) => {
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
    
    // メニュートグル
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', () => {
        toggleMobileMenu();
      });
    }
    
    // リサイズイベント
    window.addEventListener('resize', debounce(handleResize, 200));
    
    // スクロール時のヘッダー表示制御とナビゲーション目印の更新
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
    
    // モバイルメニューが開いているときに画面外をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
      if (state.isMobileMenuOpen && 
          !elements.mobileMenu.contains(e.target) && 
          !elements.menuToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
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
   * リサイズイベントのハンドラー
   */
  function handleResize() {
    console.log('ウィンドウリサイズを検知');
    
    // 画面サイズが大きくなった場合、モバイルメニューを閉じる
    if (window.innerWidth >= 768 && state.isMobileMenuOpen) {
      toggleMobileMenu(false);
    }
    
    // 必要に応じてセクションのサイズを調整
    elements.sections.forEach(section => {
      section.style.minHeight = '100vh';
    });
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
    const newState = forceState !== undefined ? forceState : !state.isMobileMenuOpen;
    
    if (newState) {
      elements.mobileMenu.classList.add('active');
      elements.menuToggle.classList.add('active');
      elements.menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      elements.mobileMenu.classList.remove('active');
      elements.menuToggle.classList.remove('active');
      elements.menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    state.isMobileMenuOpen = newState;
  }
  
  // アプリケーション初期化
  init();
}); 
