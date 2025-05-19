// import { Request, Response, NextFunction } from 'express';
// import userModel from '../DB/schema/user.model';
// import { asyncHandler } from '../utils/asyncHandler';
// import { ApiError } from '../utils/APIError';
// import { scrapeSearchPage, scrapeUserDetails } from '../utils/scrapper';
// import { summarizer } from '../utils/summerizer';

// export const searchAndSaveGithubUsers = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { query } = req.body;

//     if (!query || typeof query !== 'string') {
//       return next(new ApiError(400, 'Query is required and must be a string.'));
//     }

//     try {
//       const usersList = await scrapeSearchPage(query);
//       const detailedUsers = await scrapeUserDetails(usersList);
//       const summarizedUsers = await summarizer(detailedUsers);
//       console.log('Summarized Users:', summarizedUsers);
//       await userModel.create({
//   queryName: query,
//   users: summarizedUsers,
// });


//       res.status(200).json({
//         message: 'Scraped users saved successfully',
//         users: summarizedUsers,
//       });
//     } catch (error: any) {
//       console.error('Error scraping or saving GitHub users:', error.message);
//       return next(new ApiError(500, 'Failed to scrape and save GitHub users.'));
//     }
//   }
// );

import { Request, Response, NextFunction } from 'express';
import userModel from '../DB/schema/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/APIError';
import { scrapeSearchPage, scrapeUserDetails } from '../utils/scrapper';
import { summarizer } from '../utils/summerizer';

export const searchAndSaveGithubUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return next(new ApiError(400, 'Query is required and must be a string.'));
    }

    try {
      // Check if query already exists in DB
      const existingQuery = await userModel.findOne({ queryName: query });

      if (existingQuery) {
        res.status(200).json({
          message: 'Query found in database. Returning cached results.',
          users: existingQuery.users,
        });
      }

      // If not found, perform scraping and store
      const usersList = await scrapeSearchPage(query);
      const detailedUsers = await scrapeUserDetails(usersList);
      const summarizedUsers = await summarizer(detailedUsers);

      const savedQuery = await userModel.create({
        queryName: query,
        users: summarizedUsers,
      });

      res.status(200).json({
        message: 'Scraped users saved successfully',
        users: savedQuery.users,
      });
    } catch (error: any) {
      console.error('Error scraping or saving GitHub users:', error.message);
      return next(new ApiError(500, 'Failed to scrape and save GitHub users.'));
    }
  }
);

