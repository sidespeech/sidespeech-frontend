Moralis.Cloud.define("updateModerators", async (request) => {
    
    query.containedIn("objectId", request.params.moderatorIds);
    const results = await query.find({ useMasterKey: true });

    let moderatorToUpdate = [
        {
            filter: { objectId: request.params.colonyId },
            update: { moderators: results.map(user => user.toPointer()) }
        }
    ];

    const moderatorsUpdated = await Moralis.bulkUpdate("Colony", moderatorToUpdate);

    return moderatorsUpdated;
});


    query.containedIn("objectId", request.params.moderatorIds);
    const results = await query.find({ useMasterKey: true });

    let moderatorToUpdate = [
        {
            filter: { objectId: request.params.colonyId },
            filter: { moderators: results.map(user => user.toPointer()) }
        }
    ];

    const moderatorsDeleted = await Moralis.bulkDelete("Colony", moderatorToUpdate);

    return moderatorsDeleted;



    
    return colonyProfile;
};