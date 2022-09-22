Moralis.Cloud.define("updateModerators", async (request) => {
    const query = new Moralis.Query("User");
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

Moralis.Cloud.define("deleteModerators", async (request) => {
    const query = new Moralis.Query("User");
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
});
Moralis.Cloud.define("getColoniesMembers", async (request) => {
    const id =request.params.id;
    const query = new Moralis.Query("Colony");
    query.equalTo("objectId",id);
    const colony = await query.first();
    if(colony)
        return await colony.get("members").query().includeAll().find({ useMasterKey: true });
    else
        return [];
});
Moralis.Cloud.define("getColonyProfile", async (request) => {
    const user = Moralis.User.current();
    const profiles = await user
      ?.relation("profiles")
      .query()
      .include("colony")
      .find();
    let colonyProfile = profiles?.find((p) => p.get("colony").id === request.params.colonyId);
    
    return colonyProfile;
});