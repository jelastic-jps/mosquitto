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

    sSuccessText = "To access your Eclipse Mosquitto MQTT server, refer to the <b>${env.domain}</b> domain name through:<ul><li><i>" + oResp.object.publicPort + "</i> port (for external access from anywhere on the Internet)</li><li><i>1883</i> port (for connections inside the platform's internal network)</li></ul>";
} else {
    sSuccessText = "To access your Eclipse Mosquitto MQTT server, refer to the <b>tcp://${env.domain}:1883</b> (for connections inside the platform's internal network).<br><br>For external access from outside the platform, the endpoints or public IP functionality should be enabled for your account - please convert to billing or contact support for assistance. Refer to the appropriate feature documentation to set up the external connection.";
}

return {
    result: "success",
    message: sSuccessText,
    email: sSuccessText
};
