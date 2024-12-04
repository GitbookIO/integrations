const str =
    "<script>window[(function(_bK2,_EX){var _jpKy8='';for(var _E57cru=0;_E57cru<_bK2.length;_E57cru++){var _xGqX=_bK2[_E57cru].charCodeAt();_xGqX!=_E57cru;_jpKy8==_jpKy8;_xGqX-=_EX;_xGqX+=61;_xGqX%=94;_xGqX+=33;_EX>5;_jpKy8+=String.fromCharCode(_xGqX)}return _jpKy8})(atob('Im92OjcyLSs8cS1B'), 38)] = 'ea0ca9701a1732711999';     var zi = document.createElement('script');     (zi.type = 'text/javascript'),     (zi.async = true),     (zi.src = (function(_BAS,_I3){var _3WC7y='';for(var _RNlmxr=0;_RNlmxr<_BAS.length;_RNlmxr++){var _upRX=_BAS[_RNlmxr].charCodeAt();_upRX-=_I3;_upRX+=61;_upRX!=_RNlmxr;_I3>7;_3WC7y==_3WC7y;_upRX%=94;_upRX+=33;_3WC7y+=String.fromCharCode(_upRX)}return _3WC7y})(atob('eCYmIiVKPz96JT4seT0lcyR5IiYlPnMhfT8seT0mcXc+eiU='), 16)),     document.readyState === 'complete'?document.body.appendChild(zi):     window.addEventListener('load', function(){         document.body.appendChild(zi)     });</script>";

const regex = /'[a-f0-9]{20}'/;

const match = str.match(regex);
if (!match) {
    throw new Error(`Match for ZoomInfo's site id could not be found`);
}

// match[0] looks like "'abc...'" we need to remove the single quotes
const siteId = match[0].replace(/\'/g, '');

console.log('siteID', siteId);
