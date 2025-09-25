@@ .. @@
 export const createTemplateMiddleware = (
   req: AuthenticatedRequest,
   res: Response,
   next: NextFunction
 ) => {
   try {
     const { user } = req;
-    // Later, add a migration for has made total templates reached
 
-    // Not to exceed limit for user's on free plan
     if (
-      user.subscription.plan === EPlanIds.FREE &&
+      user.subscription?.plan === EPlanIds.FREE &&
       user.total_template_count >= FREE_TIER_LIMITS.maxTemplates
     ) {
-      res.status(400).json({
+      return res.status(400).json({
         status: false,
         message: 'Limit reached for free plan',
         data: null,
       });
-    } else {
-      next();
     }
+    next();
   } catch (err) {
-    res.status(500).json({
+    return res.status(500).json({
       status: false,
       message: 'Internal Server error',
       data: null,
     });
   }
 };