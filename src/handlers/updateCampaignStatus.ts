import prisma from "../db";



export const updateCampaignStatus = async (req, res) => {
  const { campaignId, newStatus } = req.body;
  
  try {
    if(req.body.newStatus == 'Disabled'){
      const new_id = await prisma.collaboration.deleteMany({
        where: {
          campaign_id: req.params.campaign_id
        }
      })
    }
    const updatedCampaign = await prisma.campaign.update({
      where: {
        campaign_id: req.params.campaign_id,
      },
      data: {
        status: req.body.newStatus,
      },
    });

    res.json({
      data: {
        updatedCampaign,
      },
    });
  } catch (e) {
    console.error('Error updating campaign status', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



