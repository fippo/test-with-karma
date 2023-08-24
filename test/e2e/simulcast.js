describe('simulcast', () => {
  let pc1;

  beforeEach(() => {
    pc1 = new RTCPeerConnection();
  });
  afterEach(() => {
    pc1.close();
  });

  it('using transceivers APIs', function() {
    const constraints = {video: true};
    return navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const initOpts = {
          sendEncodings: [
            {rid: 'high'},
            {rid: 'medium', scaleResolutionDownBy: 2},
            {rid: 'low', scaleResolutionDownBy: 4}
          ]
        };
        pc1.addTransceiver(stream.getVideoTracks()[0], initOpts);

        return pc1.createOffer().then((offer) => {
          const simulcastRegex =
          /a=simulcast:[\s]?send (?:rid=)?high;medium;low/g;
          return expect(simulcastRegex.test(offer.sdp)).to.equal(true);
        });
      });
  });
});
