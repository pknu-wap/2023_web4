module.exports = {
    isOwner: function (request, response) {
      if (request.session.is_logined) {
        return true;
      } else {
        return false;
      }
    },
    statusUI: function (request, response) {
      var authStatusUI = `
          <li><a href="login">로그인</a></li>
          <li><a href="register">회원가입</a></li>
          `
      if (this.isOwner(request, response)) {
        authStatusUI = `<li><a href="/mypage">마이페이지</a></li><li><a href="logout">로그아웃</a></li>`;}
      return authStatusUI;
    }
  }