import prisma from "../db";

export const createCampagin = async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          campaign_image: req.body.campaign_image,
          user_id: req.body.user_id,
          campaign_header: req.body.campaign_header,
          campaign_description: req.body.campaign_description,
          status: req.body.status,
          startedAt: parseAndFormatDate(req.body.campaignStartDate),
          endedAt: parseAndFormatDate(req.body.campaignEndDate),
        },
      });
      const collaboration = await tx.collaboration_preferences.create({
        data: {
          target_audience: req.body.target_audience,
          age_interval: req.body.age_interval,
          gender_information: req.body.gender_information,
          statistical_interval: req.body.statistical_interval,
          campaign_id: campaign.campaign_id,
        },
      });
      const tags = await tx.campaing_tags.create({
        data: {
          tag1: req.body.tag1,
          tag2: req.body.tag2,
          tag3: req.body.tag3,
          tag4: req.body.tag4,
          tag5: req.body.tag5,
          campaign_id: campaign.campaign_id,
        },
      });
      const preffered_platforms = await tx.preffered_platforms.create({
        data: {
          platform: req.body.platform,
          preference_id: collaboration.preference_id,
        },
      });
      res.json({
        data: {
          campaign: campaign,
          collaboration: collaboration,
          tags: tags,
          preffered_platforms: preffered_platforms,
        },
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};
export const getAllCampaign = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findMany({
      where: {
        user_id: req.params.id,
      },
      include:{
        proposal:true
      }
    });
    res.json({
      campaign: campaign,
    });
    /*
      for (const campaign12 of campaign) {
      const d1 = new Date(campaign12.endedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (d1 < today) {
          // You can use await here for any asynchronous operation
          // For example, updating the campaign status
          await prisma.campaign.updateMany({
              where: { campaign_id: campaign12.campaign_id },
              data: { status: 'Ended' }
          });
      }
  }
  */
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};
export const getAllCampaign_byCampaign_id = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findMany({
      where: {
        campaign_id: req.params.id,
      },
      include: {
        user: {
          include: {
            media_links: true,
            contact: true,
          },
        },
        collaboration_preferences: {
          include: {
            preffered_platforms: true,
          },
        },
        campaing_tags: true,
      },
    });
    res.json({
      campaign: campaign,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};
export const getAllCampaignInfluencer = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findMany({
      where: {
        status: {
          in: ['Active', 'pending'],
        }
      },
      include: {
        campaing_tags: true,
        collaboration_preferences: {
          include: {
            preffered_platforms: true,
          },
        },
      },
    });
        for (const campaign12 of campaign) {
      const d1 = new Date(campaign12.endedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (d1 < today) {
          console.log("bumhere")
          await prisma.campaign.updateMany({
              where: { campaign_id: campaign12.campaign_id },
              data: { status: 'Ended' }
          });
      }
  }
    res.json({
      campaign: campaign,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};
export const deleteCampaign = async (req, res) => {
  try {
    var my_id =req.params.id;
    const new_id = await prisma.collaboration.deleteMany({
      where: {
        campaign_id: my_id
      }
    })
    const campaign = await prisma.campaign.update({
      where: {
        campaign_id: req.params.id,
      },
      data:{
        status:'Disabled'
      }
      
    });

    const collaboration = await prisma.collaboration_preferences.deleteMany({
      where: {
        campaign_id: req.params.id,
      }
    });

    res.json({
      campaign: campaign,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};

function parseAndFormatDate(dateString) {
  // Parse the date string to a JavaScript Date object
  const jsDate = new Date(dateString);

  return jsDate;
}

export const getAll = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findMany({});
      for (const campaign12 of campaign) {
      const d1 = new Date(campaign12.endedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (d1 < today) {
          console.log("bumhere")
          await prisma.campaign.updateMany({
              where: { campaign_id: campaign12.campaign_id },
              data: { status: 'Ended' }
          });
      }
  }
    res.json({
      campaign: campaign,
    });
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: e });
  }
};
