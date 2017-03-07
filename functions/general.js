//Get the current user
exports.getCurrentUserObject = function(requestObject){
	var tokenId = requestObject.cookies.tkn_fid;
  return tokenId;
}