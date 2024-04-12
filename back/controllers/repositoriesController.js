import Repository from "../model/Repository.js";

const timeStampSevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const year = timeStampSevenDaysAgo.getFullYear();
const month =
  timeStampSevenDaysAgo.getMonth() < 10
    ? "0" + (timeStampSevenDaysAgo.getMonth() + 1)
    : timeStampSevenDaysAgo.getMonth() + 1;
const day =
  timeStampSevenDaysAgo.getDate() < 10
    ? "0" + timeStampSevenDaysAgo.getDate()
    : timeStampSevenDaysAgo.getDate();
const sevenDaysAgo = `${year}-${month}-${day}`;

export const saveRepositories = async (req, res) => {
  //get trending repositories from 7 days ago until now
  const repos = await fetch(
    `https://api.github.com/search/repositories?q=created:>${sevenDaysAgo}&sort=stars&order=desc`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const data = await repos.json();

  // id's of the items that have been already added to the database
  const ids = await Repository.distinct("id").exec();

  data.items.forEach(async (item) => {
    if (!ids?.includes(item?.id)) {
      const result = await Repository.create(item);
    }
    // console.log("already in database");
    return;
  });
  console.log("Repositories have been saved in the database");
};

export const getAllRepositories = async (req, res) => {
  const repositories = await Repository.find();
  if (!repositories)
    return res.status(204).json({ message: "No repositories found" });
  res.json(repositories);
};
