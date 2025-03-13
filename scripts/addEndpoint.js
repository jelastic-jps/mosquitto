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

    sSuccessText = "To access your Eclipse Mosquitto MQTT server, refer to the **${env.domain}** domain name through:\n\n- *" + oResp.object.publicPort + "* port (for external access from anywhere on the Internet)\n- *1883* port (for connections inside the platform's internal network)";
} else {
    sSuccessText = "To access your Eclipse Mosquitto MQTT server, refer to the **tcp://${env.domain}:1883** (for connections inside the platform's internal network).\n\nFor external access from outside the platform, the endpoints or public IP functionality should be enabled for your account - please convert to billing or contact support for assistance. Refer to the appropriate feature documentation to set up the external connection.";
}

return {
    result: "success",
    message: sSuccessText,
    email: sSuccessText
};
