/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.vrerv.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // To add Daum WebMaster Tool
    transformRobotsTxt: async (_, txt) => {
      return txt + "\n\n" + "#DaumWebMasterTool:88be9da1200db897941f748c5f0c36e9bf866e88b0f33d5ca7a94666505550d1:IDkXKBkzqNtyNhqWHFndBw=="
    }
  }
};
