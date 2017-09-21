//@req(nodeGroup, name, port)

var PROTOCOL = getParam("protocol", "TCP"),
    APPID = getParam("TARGET_APPID"),
    SESSION = getParam("session"),
    bEndPointsEnabled,
    sSuccessText = "",
    nNodesCount,
    oEnvInfo,
    oResp,
    i;

oResp = jelastic.billing.account.GetQuotas("environment.endpoint.enabled");

if (!oResp || oResp.result != 0) {
    return oResp;
}

bEndPointsEnabled = oResp.array[0].value;

oEnvInfo = jelastic.environment.environment.GetEnvInfo(APPID, session);

if (!oEnvInfo || oEnvInfo.result != 0) {
    return oEnvInfo;
}

nNodesCount = oEnvInfo.nodes.length;

if (bEndPointsEnabled) {
    for (i = 0; i < nNodesCount; i += 1) {
        if (oEnvInfo.nodes[i].nodeGroup == nodeGroup) {
            oResp = jelastic.environment.environment.AddEndpoint(APPID, session, oEnvInfo.nodes[i].id, port, PROTOCOL, name);

            if (!oResp || oResp.result != 0) {
                return oResp;
            }
        }
    }

    sSuccessText = "To access your Mosquitto MQTT server, refer to the <b>${env.domain}</b> domain name through either<ul><li> <i>" + oResp.object.publicPort + "</i> port (for external access from wherever in the Internet)</li><li> or <i>1883</i> port (for connecting within Plaform internal network, i.e. from another Jelastic container).</li></ul>";
} else {
    sSuccessText = "To access your Mosquitto MQTT server, refer to the <b>tcp://${env.domain}:1883</b> (for connecting within Plaform internal network, i.e. from another Jelastic container).<br><br>For external access from outside the Platform, the Endpoints functionality should be enabled for your account - please, convert to billing or contact support to get this possibility. Then refer to the same-named section within your environment settings and add a new endpoint (with Private Port <i>1883</i> and TCP protocol use) to its compute node.";
}

return {
    result: "success",
    message: sSuccessText,
    email: sSuccessText
};
