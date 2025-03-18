/**
 * LINEでカンタン勤怠 - 縦型スワイプLP用スクリプト
 * 警備業界向け勤怠管理システム紹介サイト
 */

// DOMコンテンツ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // DOM要素の取得
  const elements = {
    sections: document.querySelectorAll('.fullscreen-section'),
    navDots: document.querySelectorAll('.section-navigation li'),
    navLinks: document.querySelectorAll('.nav-link'),
    menuToggle: document.querySelector('.menu-toggle'),
    mainNav: document.querySelector('.main-nav'),
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
    scrollDelay: 800, // ms
    touchThreshold: 50 // px
  };
  
  /**
   * 初期化関数
   */
  function init() {
    console.log('縦型スワイプLP初期化');
    
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
        
        if (targetIndex !== -1) {
          scrollToSection(targetIndex);
          
          // モバイルメニューを閉じる
          elements.mainNav.classList.remove('active');
        }
      });
    });
    
    // スクロールインジケーター
    elements.scrollIndicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        if (indicator.classList.contains('top')) {
          scrollToSection(0);
        } else {
          scrollToSection(state.currentSection + 1);
        }
      });
    });
    
    // メニュートグル
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', () => {
        elements.mainNav.classList.toggle('active');
        
        // アクセシビリティのため aria-expanded を更新
        const isExpanded = elements.mainNav.classList.contains('active');
        elements.menuToggle.setAttribute('aria-expanded', isExpanded);
      });
    }
    
    // リサイズイベント
    window.addEventListener('resize', debounce(handleResize, 200));
    
    // スクロール時のヘッダー表示制御
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 50) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    }, 100));
  }
  
  /**
   * セクションをアクティブにする
   * @param {number} index - アクティブにするセクションのインデックス
   */
  function activateSection(index) {
    if (index < 0 || index >= elements.sections.length) return;
    
    // 全セクションのアクティブ状態をリセット
    elements.sections.forEach((section, i) => {
      if (i === index) {
        section.classList.add('active');
        section.setAttribute('aria-hidden', 'false');
      } else {
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
      }
    });
    
    // ナビゲーションドットの状態を更新
    elements.navDots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
      }
    });
    
    // スクロールインジケーターの表示を更新
    updateScrollIndicators(index);
    
    // セクション内の要素のアニメーション
    animateSectionElements(elements.sections[index]);
    
    // 状態更新
    state.currentSection = index;
    
    // URLハッシュの更新
    const sectionId = elements.sections[index].id;
    history.replaceState(null, null, `#${sectionId}`);
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
        const delay = element.dataset.delay ? parseInt(element.dataset.delay) : (index * 100);
        
        setTimeout(() => {
          element.classList.add('active');
        }, delay);
      });
      
      // 進捗バーのアニメーション（存在すれば）
      const progressBar = section.querySelector('.efficiency-progress');
      if (progressBar) {
        const percentage = progressBar.dataset.percent || '0';
        progressBar.style.width = `${percentage}%`;
      }
    }, 100);
  }
  
  /**
   * スクロールインジケーターの表示を更新
   * @param {number} index - 現在のセクションインデックス
   */
  function updateScrollIndicators(index) {
    const isLastSection = index === elements.sections.length - 1;
    
    elements.scrollIndicators.forEach(indicator => {
      // 最後のセクションの場合「トップに戻る」インジケーターを表示
      if (isLastSection && indicator.classList.contains('top')) {
        indicator.style.display = 'flex';
      } 
      // 最後のセクション以外では「下にスクロール」インジケーターを表示
      else if (!indicator.classList.contains('top') && !isLastSection) {
        indicator.style.display = 'flex';
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
   */
  function scrollToSection(index) {
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
    
    // スクロール処理
    const targetSection = elements.sections[index];
    const scrollOptions = {
      top: targetSection.offsetTop,
      behavior: 'smooth'
    };
    
    window.scrollTo(scrollOptions);
    
    // セクション活性化と状態リセット
    setTimeout(() => {
      activateSection(index);
      state.isScrolling = false;
    }, state.scrollDelay);
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
    // 現在のセクションが画面内に表示されるよう調整
    if (!state.isScrolling) {
      const targetSection = elements.sections[state.currentSection];
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'auto'
      });
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
          // スムーズスクロールなしで直接位置を設定
          window.scrollTo({
            top: elements.sections[targetIndex].offsetTop,
            behavior: 'auto'
          });
          activateSection(targetIndex);
        }, 100);
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
  
  // アプリケーション初期化
  init();
}); 