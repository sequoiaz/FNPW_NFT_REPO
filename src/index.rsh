'reach 0.1';
'use strict';


const CreatorInteract = {
    tokenId: Fun([], Token),
    initialPrice: Fun([], UInt),
    ready: Fun([], Null)
}

export const main =
  Reach.App(() => {

    const Creator = Participant('Creator', CreatorInteract);

    const Owner = ParticipantClass('Owner', {
        newOwner: Fun([], Address),
        showOwner: Fun([], Null) });


    init();

    Creator.only(() => {
        const nftId = declassify(interact.tokenId());
        const initialNftPrice = declassify(interact.initialPrice());
     });
    
    
    
     Creator.publish(nftId, initialNftPrice);
     const amt = 1;
     commit();

     

     
     Owner.pay(initialNftPrice);
     commit();


     
    Creator.pay([[amt, nftId]]);
    commit();
     

      
    Owner.only(() => {
      const owner = declassify(interact.newOwner());
       });
    Owner.publish(owner);
    commit();



    Creator.publish();
    transfer(initialNftPrice).to(Creator);
    // commit();
    // Creator.publish();
    transfer(amt,nftId).to(owner);
    commit();

    Creator.interact.ready();
    Owner.only(() => {
          interact.showOwner();
          });


     
   
  
    exit();
    // assert(false);
  });