// middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    res.status(500).json({
      status: 'error',
      message: err.message || '서버 에러가 발생했습니다.',
    });
  };
  